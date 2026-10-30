from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from core.views import (
    MaterialViewSet,
    AlunoViewSet,
    RetiradaViewSet,
    dashboard,
    livros,
    dashboard_api,
)
from core.auth_views import (
    cadastro,
    solicitar_redefinicao_senha,
    confirmar_redefinicao_senha,
)

router = DefaultRouter()
router.register(r'materiais', MaterialViewSet)
router.register(r'alunos', AlunoViewSet)
router.register(r'retiradas', RetiradaViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),

    path('dashboard/', dashboard, name='dashboard'),
    path('livros/', livros, name='livros'),

    path('api/dashboard/', dashboard_api),

    path("api/cadastro/", cadastro, name="cadastro"),
    path("api/password-reset/", solicitar_redefinicao_senha, name="password-reset"),
    path(
        "api/password-reset/confirm/",
        confirmar_redefinicao_senha,
        name="password-reset-confirm",
    ),

    path("api/login/", obtain_auth_token, name="login"),

    path('api/', include(router.urls)),
]