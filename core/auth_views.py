import logging
from smtplib import SMTPException

from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.core.validators import EmailValidator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

logger = logging.getLogger(__name__)
User = get_user_model()


@api_view(["POST"])
@permission_classes([AllowAny])
def cadastro(request):
    username = request.data.get("username")
    email = str(request.data.get("email", "")).strip()
    password = request.data.get("password")

    if not username or not email or not password:
        return Response(
            {"erro": "Usuário, e-mail e senha são obrigatórios"},
            status=400,
        )

    try:
        EmailValidator()(email)
    except ValidationError:
        return Response({"erro": "Informe um e-mail válido"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"erro": "Usuário já existe"}, status=400)

    if User.objects.filter(email__iexact=email).exists():
        return Response({"erro": "Este e-mail já está cadastrado"}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email,
    )
    token = Token.objects.create(user=user)

    return Response({
        "token": token.key,
        "username": user.username,
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def solicitar_redefinicao_senha(request):
    email = str(request.data.get("email", "")).strip()

    try:
        EmailValidator()(email)
    except ValidationError:
        return Response({"erro": "Informe um e-mail válido"}, status=400)

    if not settings.EMAIL_HOST or not settings.DEFAULT_FROM_EMAIL:
        return Response(
            {"erro": "A recuperação por e-mail ainda não está configurada no servidor."},
            status=503,
        )

    user = User.objects.filter(email__iexact=email, is_active=True).first()
    if user:
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        link = (
            f"{settings.FRONTEND_URL}/redefinir-senha"
            f"?uid={uid}&token={token}"
        )
        mensagem = (
            f"Olá, {user.username}.\n\n"
            "Recebemos uma solicitação para redefinir a senha da sua conta. "
            "Acesse o link abaixo para criar uma nova senha:\n\n"
            f"{link}\n\n"
            "Se você não solicitou essa alteração, ignore este e-mail."
        )

        try:
            send_mail(
                "Redefinição de senha - Biblioteca Milton",
                mensagem,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
        except (OSError, SMTPException):
            logger.exception("Falha ao enviar e-mail de redefinição de senha")
            return Response(
                {"erro": "Não foi possível enviar o e-mail agora. Tente novamente mais tarde."},
                status=503,
            )

    return Response({
        "mensagem": (
            "Se houver uma conta com esse e-mail, enviaremos as instruções "
            "para redefinir a senha."
        )
    })


@api_view(["POST"])
@permission_classes([AllowAny])
def confirmar_redefinicao_senha(request):
    uid = request.data.get("uid", "")
    token = request.data.get("token", "")
    password = request.data.get("password", "")

    try:
        user_id = urlsafe_base64_decode(uid).decode()
        user = User.objects.get(pk=user_id, is_active=True)
    except (TypeError, ValueError, UnicodeDecodeError, User.DoesNotExist):
        return Response(
            {"erro": "O link de redefinição é inválido ou expirou."},
            status=400,
        )

    if not isinstance(token, str) or not default_token_generator.check_token(user, token):
        return Response(
            {"erro": "O link de redefinição é inválido ou expirou."},
            status=400,
        )

    if not isinstance(password, str) or not password:
        return Response({"erro": "Informe uma nova senha."}, status=400)

    try:
        validate_password(password, user)
    except ValidationError as error:
        return Response({"erros": error.messages}, status=400)

    user.set_password(password)
    user.save(update_fields=["password"])
    Token.objects.filter(user=user).delete()

    return Response({
        "mensagem": "Senha redefinida com sucesso. Faça login com a nova senha."
    })
