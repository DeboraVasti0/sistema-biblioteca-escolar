from django.utils import timezone
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

    # Se o frontend não enviar a data, usa a data de hoje (fuso do settings).
    data_retirada = serializers.DateField(default=timezone.localdate)

    class Meta:
        model = Retirada
        fields = [
            "id",
            "aluno",
            "aluno_nome",
            "material",
            "material_titulo",
            "quantidade",
            "data_retirada",
            "data_devolucao",
        ]
        # A devolução é registrada pela ação /retiradas/<id>/devolver/.
        read_only_fields = ["data_devolucao"]

    def validate(self, data):
        instance = self.instance
        material = data.get("material", instance.material if instance else None)
        quantidade = data.get("quantidade", instance.quantidade if instance else 1)

        if quantidade < 1:
            raise serializers.ValidationError(
                "A quantidade deve ser maior que zero."
            )

        # Em uma edição, o que a própria retirada já tirou volta a contar.
        disponivel = material.estoque
        if instance and instance.material_id == material.id:
            disponivel += instance.quantidade_fora()

        devolvida = instance.devolvida if instance else False
        if not devolvida and quantidade > disponivel:
            raise serializers.ValidationError(
                f"Estoque insuficiente. Disponível: {disponivel}"
            )

        return data