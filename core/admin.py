from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Aluno, Material, Retirada


@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    search_fields = ['ra', 'nome']
    list_display = ['ra', 'nome', 'turma']


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'tipo', 'autor', 'ano', 'estoque']
    search_fields = ['titulo', 'autor']
    list_filter = ['tipo', 'ano']

@admin.register(Retirada)
class RetiradaAdmin(admin.ModelAdmin):
    list_display = ['aluno', 'material', 'quantidade', 'data_retirada']
    list_filter = ['data_retirada', 'material']
    search_fields = ['aluno__nome', 'aluno__ra', 'material__titulo']
   
