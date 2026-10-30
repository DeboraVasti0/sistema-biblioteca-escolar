
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Menu from "./components/Menu";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Materiais from "./pages/Materiais";
import Alunos from "./pages/Alunos";
import Retiradas from "./pages/Retiradas";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import EsqueciSenha from "./pages/EsqueciSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import AdicionarMaterial from "./pages/AdicionarMaterial";
import NovaRetirada from "./pages/NovaRetirada";
import "./App.css";

function RotaProtegida({ children, autenticado }) {
  return autenticado ? children : <Navigate to="/login" replace />;
}

function App() {
  const [autenticado, setAutenticado] = useState(
    () => !!localStorage.getItem("token")
  );

  useEffect(() => {
    function verificarAutenticacao() {
      setAutenticado(!!localStorage.getItem("token"));
    }

    window.addEventListener("authChange", verificarAutenticacao);

    return () => {
      window.removeEventListener("authChange", verificarAutenticacao);
    };
  }, []);

  return (
    <BrowserRouter>
       <div className="layout">
        <Menu autenticado={autenticado} />

         <main className="conteudo-principal">
        
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/esqueci-senha" element={<EsqueciSenha />} />
            <Route path="/redefinir-senha" element={<RedefinirSenha />} />

            <Route
              path="/dashboard"
              element={
                <RotaProtegida autenticado={autenticado}>
                  <Dashboard />
                </RotaProtegida>
              }
            />

            <Route
              path="/materiais"
              element={
                <RotaProtegida autenticado={autenticado}>
                  <Materiais />
                </RotaProtegida>
              }
            />

            <Route
              path="/alunos"
              element={
                <RotaProtegida autenticado={autenticado}>
                  <Alunos />
                </RotaProtegida>
              }
            />

            <Route
              path="/retiradas"
              element={
                <RotaProtegida autenticado={autenticado}>
                  <Retiradas />
                </RotaProtegida>
              }
            />

            <Route
              path="/adicionar-material"
              element={
                <RotaProtegida autenticado={autenticado}>
                  <AdicionarMaterial />
                </RotaProtegida>
              }
            />

            <Route
              path="/nova-retirada"
              element={
                <RotaProtegida autenticado={autenticado}>
                  <NovaRetirada />
                </RotaProtegida>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
