from rest_framework import serializers
from .models import Material, Aluno, Retirada


class MaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Material
        fields = '__all__'


class AlunoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = '__all__'

class RetiradaSerializer(serializers.ModelSerializer):

    aluno_nome = serializers.CharField(
        source="aluno.nome",
        read_only=True
    )

    material_titulo = serializers.CharField(
        source="material.titulo",
        read_only=True
    )

    class Meta:
        model = Retirada
        fields = [
            "id",
            "aluno",
            "aluno_nome",
            "material",
            "material_titulo",
            "quantidade",
            "data_retirada"
        ]

    def validate(self, data):
        material = data.get("material")
        quantidade = data.get("quantidade")

        if quantidade > material.estoque:
            raise serializers.ValidationError(
                f"Estoque insuficiente. Disponível: {material.estoque}"
            )

        return data