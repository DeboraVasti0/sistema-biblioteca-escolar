from django.core import mail
from django.test import override_settings
from django.contrib.auth import get_user_model
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from rest_framework.test import APITestCase


User = get_user_model()


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    EMAIL_HOST="smtp.example.com",
    DEFAULT_FROM_EMAIL="noreply@example.com",
    FRONTEND_URL="http://localhost:5173",
)
class PasswordRecoveryTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="biblioteca-user",
            email="aluno@example.com",
            password="Original-password-538!",
        )

    def test_password_reset_request_sends_one_time_link(self):
        response = self.client.post(
            "/api/password-reset/",
            {"email": self.user.email},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn("/redefinir-senha?uid=", mail.outbox[0].body)
        self.assertIn("&token=", mail.outbox[0].body)

    def test_password_reset_request_does_not_reveal_unknown_email(self):
        response = self.client.post(
            "/api/password-reset/",
            {"email": "unknown@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(mail.outbox), 0)
        self.assertIn("Se houver uma conta", response.data["mensagem"])

    @override_settings(EMAIL_HOST="", DEFAULT_FROM_EMAIL="")
    def test_password_reset_reports_missing_email_configuration(self):
        response = self.client.post(
            "/api/password-reset/",
            {"email": self.user.email},
            format="json",
        )

        self.assertEqual(response.status_code, 503)

    def test_password_reset_changes_password_and_invalidates_token(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        response = self.client.post(
            "/api/password-reset/confirm/",
            {
                "uid": uid,
                "token": token,
                "password": "New-secure-password-381!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("New-secure-password-381!"))
        self.assertFalse(default_token_generator.check_token(self.user, token))

    def test_password_reset_rejects_invalid_token(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        response = self.client.post(
            "/api/password-reset/confirm/",
            {
                "uid": uid,
                "token": "invalid-token",
                "password": "New-secure-password-381!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password("Original-password-538!"))

    def test_password_reset_rejects_weak_password(self):
        uid = urlsafe_base64_encode(force_bytes(self.user.pk))
        token = default_token_generator.make_token(self.user)
        response = self.client.post(
            "/api/password-reset/confirm/",
            {"uid": uid, "token": token, "password": "short"},
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertTrue(response.data["erros"])

    def test_registration_requires_and_saves_email(self):
        response = self.client.post(
            "/api/cadastro/",
            {
                "username": "new-library-user",
                "email": "new-user@example.com",
                "password": "New-user-password-763!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            User.objects.filter(
                username="new-library-user",
                email="new-user@example.com",
            ).exists()
        )
