import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "./Page.css";

function RedefinirSenha() {
    const [searchParams] = useSearchParams();
    const uid = searchParams.get("uid") || "";
    const token = searchParams.get("token") || "";
    const [password, setPassword] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setMensagem("");
        setErro("");

        if (password !== confirmacao) {
            setErro("As senhas não conferem.");
            return;
        }

        setCarregando(true);

        try {
            const response = await api.post("password-reset/confirm/", {
                uid,
                token,
                password
            });
            setMensagem(response.data.mensagem);
        } catch (error) {
            console.error(
                "Erro ao redefinir senha:",
                error.response?.data || error
            );
            const errosSenha = error.response?.data?.erros;
            setErro(
                (Array.isArray(errosSenha) && errosSenha.join(" ")) ||
                error.response?.data?.erro ||
                "Não foi possível redefinir a senha. Solicite um novo link."
            );
        } finally {
            setCarregando(false);
        }
    }

    const linkValido = Boolean(uid && token);

    return (
        <main className="login-page">
            <section className="login-card">
                <h1>Nova senha</h1>
                <p className="login-subtitle">
                    Escolha uma senha segura para sua conta.
                </p>

                {!linkValido ? (
                    <p className="auth-feedback auth-feedback-error" role="alert">
                        O link de redefinição está incompleto ou inválido.
                    </p>
                ) : (
                    <form className="form-auth" onSubmit={handleSubmit}>
                        <input
                            type="password"
                            placeholder="Nova senha"
                            autoComplete="new-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />

                        <input
                            type="password"
                            placeholder="Confirme a nova senha"
                            autoComplete="new-password"
                            value={confirmacao}
                            onChange={(event) => setConfirmacao(event.target.value)}
                            required
                        />

                        {mensagem && (
                            <p className="auth-feedback" role="status">
                                {mensagem}
                            </p>
                        )}
                        {erro && (
                            <p className="auth-feedback auth-feedback-error" role="alert">
                                {erro}
                            </p>
                        )}

                        {!mensagem && (
                            <button
                                type="submit"
                                className="btn-entrar"
                                disabled={carregando}
                            >
                                {carregando ? "Salvando..." : "Salvar nova senha"}
                            </button>
                        )}
                    </form>
                )}

                <Link className="auth-back-link" to="/login">
                    Ir para o login
                </Link>
            </section>
        </main>
    );
}

export default RedefinirSenha;
