from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models


class Perfil(models.Model):
    PROFESSOR = 'professor'
    ALUNO = 'aluno'
    TIPOS = [
        (PROFESSOR, 'Professor'),
        (ALUNO, 'Aluno'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='perfil',
    )
    tipo = models.CharField(max_length=20, choices=TIPOS, default=ALUNO)

    def __str__(self):
        return f'{self.user.username} ({self.get_tipo_display()})'


def tipo_do_usuario(user):
    """Retorna 'professor' ou 'aluno'.

    Superusuários e membros da equipe (is_staff) são sempre professores.
    Usuários sem perfil são tratados como aluno (somente consulta).
    """
    if not user or not user.is_authenticated:
        return None
    if user.is_superuser or user.is_staff:
        return Perfil.PROFESSOR
    perfil = getattr(user, 'perfil', None)
    return perfil.tipo if perfil else Perfil.ALUNO


class Aluno(models.Model):
    ra = models.CharField(max_length=20, unique=True)
    nome = models.CharField(max_length=100)
    turma = models.CharField(max_length=20)

    def __str__(self):
        return self.nome


class Material(models.Model):
    titulo = models.CharField(max_length=200)
    tipo = models.CharField(max_length=20)
    estoque = models.IntegerField()
    autor = models.CharField(max_length=100, blank=True)
    ano = models.IntegerField(null=True, blank=True)

    # Novo campo para link do material digital
    link_material = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.titulo


class Retirada(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    material = models.ForeignKey(Material, on_delete=models.CASCADE)
    quantidade = models.IntegerField(default=1)
    data_retirada = models.DateField()

    def clean(self):
        if self.material and self.quantidade > self.material.estoque:
            raise ValidationError({
                'quantidade': 'Estoque insuficiente.'
            })

    def save(self, *args, **kwargs):
        self.clean()

        self.material.estoque -= self.quantidade
        self.material.save()

        super().save(*args, **kwargs)