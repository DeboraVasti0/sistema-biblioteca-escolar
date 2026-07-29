import { Link } from "react-router-dom";
import "./Menu.css";

function Menu() {
  return (
    <div className="sidebar">
      <h2>📚 Biblioteca Milton</h2>

      <Link to="/">🏠 Home</Link>
      <Link to="/dashboard">📊 Dashboard</Link>
      <Link to="/materiais">📚 Materiais</Link>
      <Link to="/alunos">👨‍🎓 Alunos</Link>
      <Link to="/retiradas">📖 Retiradas</Link>
    </div>
  );
}

export default Menu;