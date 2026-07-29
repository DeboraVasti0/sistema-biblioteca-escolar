from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Material, Aluno, Retirada
from django.db.models import Sum
from .serializers import MaterialSerializer, AlunoSerializer, RetiradaSerializer


def dashboard(request):
    total_alunos = Aluno.objects.count()
    total_materiais = Material.objects.count()
    total_retiradas = Retirada.objects.count()

    estoque_baixo = Material.objects.filter(estoque__lt=5)
    quantidade_estoque_baixo = estoque_baixo.count()

    ultimas_retiradas = Retirada.objects.order_by('-data_retirada')[:5]

    materiais_mais_retirados = (
        Retirada.objects
        .values('material__titulo')
        .annotate(total=Sum('quantidade'))
        .order_by('-total')[:5]
    )

    context = {
        'total_alunos': total_alunos,
        'total_materiais': total_materiais,
        'total_retiradas': total_retiradas,
        'estoque_baixo': estoque_baixo,
        'quantidade_estoque_baixo': quantidade_estoque_baixo,
        'ultimas_retiradas': ultimas_retiradas,
        'materiais_mais_retirados': materiais_mais_retirados,
    }

    return render(request, 'dashboard.html', context)


def livros(request):
    materiais = Material.objects.all()
    
    context = {
        'materiais': materiais
    }

    return render(request, 'livros.html', context)


class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer


class RetiradaViewSet(viewsets.ModelViewSet):
    queryset = Retirada.objects.all()
    serializer_class = RetiradaSerializer

@api_view(['GET'])
def dashboard_api(request):

    dados = {
        "total_alunos": Aluno.objects.count(),
        "total_materiais": Material.objects.count(),
        "total_retiradas": Retirada.objects.count(),
        "estoque_baixo": Material.objects.filter(estoque__lt=5).count(),
    }

    return Response(dados)

from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


@api_view(["POST"])
@permission_classes([AllowAny])
def cadastro(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"erro": "Usuário e senha são obrigatórios"},
            status=400
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"erro": "Usuário já existe"},
            status=400
        )

    user = User.objects.create_user(
        username=username,
        password=password
    )

    token = Token.objects.create(user=user)

    return Response({
        "token": token.key,
        "username": user.username
    })