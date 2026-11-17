from django.contrib.auth.models import User
from django.db.models import Sum
from django.shortcuts import render
from django.utils import timezone
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import Aluno, Material, Perfil, Retirada, tipo_do_usuario
from .permissions import IsProfessor, IsProfessorOrReadOnly
from .serializers import AlunoSerializer, MaterialSerializer, RetiradaSerializer


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


# Materiais: aluno consulta, professor gerencia.
class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer
    permission_classes = [IsProfessorOrReadOnly]


# Alunos: dados pessoais (RA, turma) — somente professores.
class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    permission_classes = [IsAuthenticated, IsProfessor]


# Retiradas: aluno consulta o histórico, professor registra.
class RetiradaViewSet(viewsets.ModelViewSet):
    queryset = Retirada.objects.select_related("aluno", "material").order_by(
        "-data_retirada", "-id"
    )
    serializer_class = RetiradaSerializer
    permission_classes = [IsProfessorOrReadOnly]

    # POST /api/retiradas/<id>/devolver/ — registra a devolução.
    @action(
        detail=True,
        methods=["post"],
        permission_classes=[IsAuthenticated, IsProfessor],
    )
    def devolver(self, request, pk=None):
        retirada = self.get_object()

        if retirada.devolvida:
            return Response(
                {"erro": "Esta retirada já foi devolvida."},
                status=400
            )

        retirada.data_devolucao = timezone.localdate()
        retirada.save()  # o save() devolve a quantidade ao estoque

        return Response(self.get_serializer(retirada).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_api(request):

    dados = {
        "total_alunos": Aluno.objects.count(),
        "total_materiais": Material.objects.count(),
        "total_retiradas": Retirada.objects.count(),
        "estoque_baixo": Material.objects.filter(estoque__lt=5).count(),
        # Usado pelo frontend logo após o login para saber o perfil.
        "usuario": {
            "username": request.user.username,
            "tipo": tipo_do_usuario(request.user),
        },
    }

    return Response(dados)


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

    # Cadastro público sempre cria ALUNO. Professores são promovidos
    # pelo admin do Django (Perfil.tipo = professor ou "membro da equipe").
    Perfil.objects.create(user=user, tipo=Perfil.ALUNO)

    token = Token.objects.create(user=user)

    return Response({
        "token": token.key,
        "username": user.username,
        "tipo": Perfil.ALUNO,
    })

