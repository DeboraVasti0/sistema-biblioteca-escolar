from django.core.exceptions import ValidationError
from django.db import models


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