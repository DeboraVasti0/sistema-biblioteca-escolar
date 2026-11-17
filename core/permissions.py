from rest_framework.permissions import SAFE_METHODS, BasePermission

from .models import Perfil, tipo_do_usuario


class IsProfessor(BasePermission):
    """Acesso total somente para professores."""

    message = 'Apenas professores podem realizar esta ação.'

    def has_permission(self, request, view):
        return tipo_do_usuario(request.user) == Perfil.PROFESSOR


class IsProfessorOrReadOnly(BasePermission):
    """Qualquer usuário logado pode consultar (GET);
    criar, editar e excluir é exclusivo de professores."""

    message = 'Alunos têm acesso somente para consulta.'

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in SAFE_METHODS:
            return True
        return tipo_do_usuario(request.user) == Perfil.PROFESSOR
