import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import "./Page.css";

function EsqueciSenha() {
    const [email, setEmail] = useState("");
    const [mensagem, setMensagem] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setMensagem("");
        setErro("");
        setCarregando(true);

        try {
            const response = await api.post("password-reset/", { email });
            setMensagem(response.data.mensagem);
        } catch (error) {
            console.error(
                "Erro ao solicitar redefinição de senha:",
                error.response?.data || error
            );
            setErro(
                error.response?.data?.erro ||
                "Não foi possível solicitar a redefinição. Tente novamente."
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-card">
                <h1>Recuperar senha</h1>
                <p className="login-subtitle">
                    Informe o e-mail vinculado à sua conta.
                </p>

                <form className="form-auth" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Seu e-mail"
                        autoComplete="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
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

                    <button
                        type="submit"
                        className="btn-entrar"
                        disabled={carregando}
                    >
                        {carregando ? "Enviando..." : "Enviar instruções"}
                    </button>
                </form>

                <Link className="auth-back-link" to="/login">
                    Voltar ao login
                </Link>
            </section>
        </main>
    );
}

export default EsqueciSenha;
