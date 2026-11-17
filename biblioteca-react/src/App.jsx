
import { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import api from "./services/api";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Materiais from "./pages/Materiais";
import Alunos from "./pages/Alunos";
import Retiradas from "./pages/Retiradas";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import AdicionarMaterial from "./pages/AdicionarMaterial";
import NovaRetirada from "./pages/NovaRetirada";
import "./App.css";

function limparSessao() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("tipo");
  window.dispatchEvent(new Event("authChange"));
}

// Envia o token em todas as requisições para a API.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Token inválido/expirado: encerra a sessão.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      limparSessao();
    }
    return Promise.reject(error);
  }
);

function lerSessao() {
  return {
    autenticado: !!localStorage.getItem("token"),
    tipo: localStorage.getItem("tipo") || "aluno",
  };
}

// Exige login (professor ou aluno).
function RotaProtegida({ children, autenticado }) {
  return autenticado ? children : <Navigate to="/login" replace />;
}

// Exige login de professor.
function RotaProfessor({ children, autenticado, tipo }) {
  if (!autenticado) return <Navigate to="/login" replace />;
  if (tipo !== "professor") return <Navigate to="/dashboard" replace />;
  return children;
}

function App() {
  const [sessao, setSessao] = useState(lerSessao);
  const { autenticado, tipo } = sessao;

  useEffect(() => {
    function verificarAutenticacao() {
      setSessao(lerSessao());
    }

    window.addEventListener("authChange", verificarAutenticacao);

    return () => {
      window.removeEventListener("authChange", verificarAutenticacao);
    };
  }, []);

  return (
    <BrowserRouter>
       <div className="layout">
        <Menu autenticado={autenticado} tipo={tipo} />

         <main className="conteudo-principal">

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            {/* Professor e aluno (consulta) */}
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
              path="/retiradas"
              element={
                <RotaProtegida autenticado={autenticado}>
                  <Retiradas />
                </RotaProtegida>
              }
            />

            {/* Somente professor */}
            <Route
              path="/alunos"
              element={
                <RotaProfessor autenticado={autenticado} tipo={tipo}>
                  <Alunos />
                </RotaProfessor>
              }
            />

            <Route
              path="/adicionar-material"
              element={
                <RotaProfessor autenticado={autenticado} tipo={tipo}>
                  <AdicionarMaterial />
                </RotaProfessor>
              }
            />

            <Route
              path="/nova-retirada"
              element={
                <RotaProfessor autenticado={autenticado} tipo={tipo}>
                  <NovaRetirada />
                </RotaProfessor>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
