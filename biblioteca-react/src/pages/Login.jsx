import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Page.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    try {
      const response = await api.post("login/", {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", username);

      navigate("/dashboard");
    } catch (err) {
      setErro("Usuário ou senha inválidos.");
    }
  }

  return (
    <div className="home">
      <h1>Entrar</h1>

      <form className="form-auth" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {erro && <p className="erro">{erro}</p>}

        <button type="submit" className="btn-entrar">
          Entrar
        </button>

         <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Cancelar
          </button>
      </form>
    </div>
  );
}

export default Login;