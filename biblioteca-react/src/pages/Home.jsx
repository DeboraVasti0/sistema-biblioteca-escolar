
import "./Page.css";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <div className="home">
        <h1>Biblioteca Milton</h1>
        <p>Sistema de gerenciamento de biblioteca escolar</p>

        <div className="botoes">
          <button
            className="btn-entrar"
            onClick={() => navigate("/login")}
          >
            Entrar
          </button>

          <button
            className="btn-cadastrar"
            onClick={() => navigate("/cadastro")}
          >
            Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
