import { BrowserRouter, Routes, Route } from "react-router-dom";

import Materiais from "./pages/Materiais";
import Alunos from "./pages/Alunos";
import Retiradas from "./pages/Retiradas";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Menu from "./components/Menu";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import AdicionarMaterial from "./pages/AdicionarMaterial";
import NovaRetirada from "./pages/NovaRetirada";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="layout">

        <Menu />

        <div className="content">
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/materiais" element={<Materiais />} />
            <Route path="/alunos" element={<Alunos />} />
            <Route path="/retiradas" element={<Retiradas />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/adicionar-material" element={<AdicionarMaterial />} />
            <Route path="/nova-retirada" element={<NovaRetirada />} />
          
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;