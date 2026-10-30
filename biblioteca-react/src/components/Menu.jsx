
import { Link, useNavigate } from "react-router-dom";
import "./Menu.css";

function Menu({ autenticado }) {
    const navigate = useNavigate();

    function sair() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");

        window.dispatchEvent(new Event("authChange"));

        navigate("/login");
    }

    return (
        <div className="sidebar">

            <h2>📚 Biblioteca Milton</h2>

            {!autenticado ? (

                <div className="menu-bloqueado">
                    <p>🔒 Acesso bloqueado</p>
                    <p>Faça login para acessar o sistema.</p>

                    <Link to="/login" className="menu-login">
                        🔑 Entrar
                    </Link>
                </div>

            ) : (

                <>
                    <p className="usuario-logado">
                        👤 {localStorage.getItem("username")}
                    </p>

                    <Link to="/">🏠 Home</Link>

                    <Link to="/dashboard">📊 Dashboard</Link>

                    <Link to="/materiais">📚 Materiais</Link>

                    <Link to="/alunos">👨‍🎓 Alunos</Link>

                    <Link to="/retiradas">📖 Retiradas</Link>

                    <button
                        className="btn-sair"
                        onClick={sair}
                    >
                        🚪 Sair
                    </button>
                </>

            )}

        </div>
    );
}

export default Menu;
