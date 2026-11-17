from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models, transaction
from django.db.models import F


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
    # Preenchida quando o material volta para a biblioteca.
    data_devolucao = models.DateField(null=True, blank=True)

    @property
    def devolvida(self):
        return self.data_devolucao is not None

    def quantidade_fora(self):
        """Quanto esta retirada está tirando do estoque agora."""
        return 0 if self.devolvida else self.quantidade

    def estoque_disponivel(self):
        """Estoque que esta retirada pode usar, contando o que ela
        própria já tirou do mesmo material (caso de edição)."""
        material = Material.objects.get(pk=self.material_id)
        disponivel = material.estoque
        if self.pk:
            antiga = Retirada.objects.filter(pk=self.pk).first()
            if antiga and antiga.material_id == self.material_id:
                disponivel += antiga.quantidade_fora()
        return disponivel

    def clean(self):
        if self.quantidade is not None and self.quantidade < 1:
            raise ValidationError({'quantidade': 'A quantidade deve ser maior que zero.'})
        if self.material_id and self.quantidade_fora() > self.estoque_disponivel():
            raise ValidationError({'quantidade': 'Estoque insuficiente.'})

    def save(self, *args, **kwargs):
        with transaction.atomic():
            # 1. Devolve ao estoque o que a versão anterior tinha tirado.
            if self.pk:
                antiga = Retirada.objects.select_for_update().filter(pk=self.pk).first()
                if antiga and antiga.quantidade_fora():
                    Material.objects.filter(pk=antiga.material_id).update(
                        estoque=F('estoque') + antiga.quantidade_fora()
                    )

            # 2. Tira do estoque o que a versão nova precisa.
            material = Material.objects.select_for_update().get(pk=self.material_id)
            if self.quantidade_fora() > material.estoque:
                raise ValidationError({'quantidade': 'Estoque insuficiente.'})
            material.estoque -= self.quantidade_fora()
            material.save(update_fields=['estoque'])
            self.material = material

            super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Excluir uma retirada não devolvida devolve o material ao estoque.
        with transaction.atomic():
            if self.quantidade_fora():
                Material.objects.filter(pk=self.material_id).update(
                    estoque=F('estoque') + self.quantidade_fora()
                )
            return super().delete(*args, **kwargs)