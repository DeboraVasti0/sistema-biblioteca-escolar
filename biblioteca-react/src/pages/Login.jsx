
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Page.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setErro("");
        setCarregando(true);

        try {
            const response = await api.post("login/", {
                username,
                password
            });

            const token = response.data.token;
            if (!token) {
                setErro("O servidor não retornou o token.");
                return;
            }

            localStorage.setItem("token", token);
            localStorage.setItem("username", username);

            window.dispatchEvent(new Event("authChange"));
            navigate("/dashboard");

        } catch (error) {
            console.error("Erro no login:", error.response?.data || error);
            setErro("Usuário ou senha inválidos.");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <section className="login-page">
            <div className="login-card">
                <h1>Entrar</h1>
                <p className="login-subtitle">
                    Acesse sua conta para continuar
                </p>

                <form className="form-auth" onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Usuário"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Senha"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {erro && <p className="erro">{erro}</p>}

                    <button
                        type="submit"
                        className="btn-entrar"
                        disabled={carregando}
                    >
                        {carregando ? "Entrando..." : "Entrar"}
                    </button>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate("/")}
                    >
                        Voltar ao início
                    </button>

                </form>
            </div>
        </section>
    );
}

export default Login;
