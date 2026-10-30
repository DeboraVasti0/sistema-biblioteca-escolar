
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Page.css";

function Materiais() {
    const [materiais, setMateriais] = useState([]);
    const [busca, setBusca] = useState("");
    const [carregando, setCarregando] = useState(true);

    const navigate = useNavigate();

    // Carregar materiais da API
    async function carregarMateriais() {
        try {
            setCarregando(true);

            const response = await api.get("materiais/");
            const dados = response.data.results ?? response.data;

            setMateriais(Array.isArray(dados) ? dados : []);
        } catch (error) {
            console.error("Erro ao carregar materiais:", error.response?.data || error);
            alert("Não foi possível carregar os materiais.");
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        carregarMateriais();
    }, []);

    // Pesquisar materiais
    const materiaisFiltrados = materiais.filter((material) =>
        material.titulo?.toLowerCase().includes(busca.toLowerCase())
    );

    // Excluir material
    async function excluirMaterial(id) {
        const confirmar = window.confirm(
            "Deseja realmente excluir este material?"
        );

        if (!confirmar) return;

        try {
            await api.delete(`materiais/${id}/`);
            alert("Material excluído com sucesso!");
            await carregarMateriais();
        } catch (error) {
            console.error("Erro ao excluir:", error.response?.data || error);
            alert("Não foi possível excluir o material.");
        }
    }

    // Editar material
    async function editarMaterial(material) {
        const titulo = window.prompt("Novo título:", material.titulo || "");

        if (titulo === null) return;

        if (!titulo.trim()) {
            alert("O título não pode ficar vazio.");
            return;
        }

        const autor = window.prompt("Novo autor:", material.autor || "");

        if (autor === null) return;

        const estoque = window.prompt(
            "Novo estoque:",
            String(material.estoque ?? 0)
        );

        if (estoque === null) return;

        const estoqueNumero = Number(estoque);

        if (
            estoque.trim() === "" ||
            !Number.isInteger(estoqueNumero) ||
            estoqueNumero < 0
        ) {
            alert("Informe um estoque válido.");
            return;
        }

        try {
            await api.patch(`materiais/${material.id}/`, {
                titulo: titulo.trim(),
                autor: autor.trim(),
                estoque: estoqueNumero
            });

            alert("Material atualizado com sucesso!");
            await carregarMateriais();
        } catch (error) {
            console.error("Erro ao editar material:", error.response?.data || error);

            const mensagem = error.response?.data
                ? JSON.stringify(error.response.data)
                : "Verifique se o servidor Django está funcionando.";

            alert("Erro ao atualizar material:\n" + mensagem);
        }
    }

    return (
        <div className="page-container materiais-container">

            <h1>Materiais</h1>

            <div className="materiais-cabecalho">
                <input
                    className="barra-pesquisa"
                    type="text"
                    placeholder="🔍 Pesquisar material..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                <button
                    className="btn-primary"
                    onClick={() => navigate("/adicionar-material")}
                >
                    + Adicionar material
                </button>
            </div>

            {carregando ? (
                <p>Carregando materiais...</p>
            ) : materiaisFiltrados.length === 0 ? (
                <p>Nenhum material encontrado.</p>
            ) : (
                <div className="materiais-grid">
                    {materiaisFiltrados.map((material) => (
                        <div key={material.id} className="material-card">

                            <h2>{material.titulo}</h2>

                            <p>
                                <strong>Autor:</strong>{" "}
                                {material.autor || "Não informado"}
                            </p>

                            <p>
                                <strong>Estoque:</strong>{" "}
                                {material.estoque}
                            </p>

                            {material.link_material && (
                                <p>
                                    <a
                                        href={material.link_material}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Acessar material
                                    </a>
                                </p>
                            )}

                            <div className="material-acoes">
                                <button
                                    className="btn-primary"
                                    onClick={() => editarMaterial(material)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn-danger"
                                    onClick={() => excluirMaterial(material.id)}
                                >
                                    Excluir
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
}

export default Materiais;
