import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Page.css";

function Cadastro() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("cadastro/", {
        username,
        email,
        password
      });
      navigate("/login");
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      setErro(
        error.response?.data?.erro ||
        "Não foi possível concluir o cadastro. Tente novamente."
      );
    }
  }

  return (
    <div className="page">
      <div className="home">
        <h1>Cadastro</h1>
        
            <form className="form-material" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />

          <input
            type="email"
            placeholder="E-mail para recuperação de senha"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          {erro && <p className="erro">{erro}</p>}

          <button type="submit">
            Cadastrar
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
    </div>
  );
}

export default Cadastro;