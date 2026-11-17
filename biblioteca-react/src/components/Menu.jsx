
import { Link, useNavigate } from "react-router-dom";
import "./Menu.css";

function Menu({ autenticado, tipo }) {
    const navigate = useNavigate();
    const professor = tipo === "professor";

    function sair() {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("tipo");

        window.dispatchEvent(new Event("authChange"));

        navigate("/login");
    }

    return (
        <div className="sidebar">

            <h2>
                <span className="menu-brand-icon" aria-hidden="true">📚</span>
                <span className="menu-brand-label">Biblioteca Milton</span>
            </h2>

            {!autenticado ? (

                <div className="menu-bloqueado">
                    <p className="menu-lock-message">🔒 Acesso bloqueado</p>
                    <p className="menu-lock-message">Faça login para acessar o sistema.</p>

                    <Link to="/login" className="menu-login" aria-label="Entrar">
                        <span className="menu-icon" aria-hidden="true">🔑</span>
                        <span className="menu-label">Entrar</span>
                    </Link>
                </div>

            ) : (

                <>
                    <p className="usuario-logado">
                        <span className="menu-icon" aria-hidden="true">👤</span>
                        <span className="menu-label">
                            {localStorage.getItem("username")} ({professor ? "Professor" : "Aluno"})
                        </span>
                    </p>

                    <nav className="menu-links" aria-label="Navegação principal">
                        <Link to="/" aria-label="Home"><span className="menu-icon" aria-hidden="true">🏠</span><span className="menu-label">Home</span></Link>
                        <Link to="/dashboard" aria-label="Dashboard"><span className="menu-icon" aria-hidden="true">📊</span><span className="menu-label">Dashboard</span></Link>
                        <Link to="/materiais" aria-label="Materiais"><span className="menu-icon" aria-hidden="true">📚</span><span className="menu-label">Materiais</span></Link>
                        {professor && (
                            <Link to="/alunos" aria-label="Alunos"><span className="menu-icon" aria-hidden="true">👨‍🎓</span><span className="menu-label">Alunos</span></Link>
                        )}
                        <Link to="/retiradas" aria-label="Retiradas"><span className="menu-icon" aria-hidden="true">📖</span><span className="menu-label">Retiradas</span></Link>
                    </nav>

                    <button
                        className="btn-sair"
                        onClick={sair}
                        aria-label="Sair"
                    >
                        <span className="menu-icon" aria-hidden="true">🚪</span>
                        <span className="menu-label">Sair</span>
                    </button>
                </>

            )}

        </div>
    );
}

export default Menu;
