
import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Page.css";

function AdicionarMaterial() {
    const [titulo, setTitulo] = useState("");
    const [tipo, setTipo] = useState("");
    const [autor, setAutor] = useState("");
    const [estoque, setEstoque] = useState("0");
    const [link_material, setLinkMaterial] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!titulo.trim()) {
            alert("Informe o título do material.");
            return;
        }

        if (!tipo) {
            alert("Selecione o tipo de material.");
            return;
        }

        if (
            estoque.trim() === "" ||
            !Number.isInteger(Number(estoque)) ||
            Number(estoque) < 0
        ) {
            alert("Informe uma quantidade de estoque válida.");
            return;
        }

        try {
            const dados = {
                titulo: titulo.trim(),
                tipo: tipo,
                autor: autor.trim(),
                estoque: Number(estoque),
                link_material: link_material.trim()
            };

            await api.post("materiais/", dados);

            alert("Material adicionado com sucesso!");
            navigate("/materiais");

        } catch (error) {
            console.error(
                "Erro ao adicionar material:",
                error.response?.data || error
            );

            alert(
                "Erro ao adicionar material: " +
                JSON.stringify(error.response?.data || "Erro de conexão")
            );
        }
    }

    return (
        <div className="page">

            <h1>Adicionar Material</h1>

            <form className="form-material" onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Título do material"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                />

                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    required
                >
                    <option value="">Selecione o tipo</option>
                    <option value="Livro">Livro</option>
                    <option value="Revista">Revista</option>
                    <option value="Apostila">Apostila</option>
                    <option value="Outro">Outro</option>
                </select>

                <input
                    type="text"
                    placeholder="Autor"
                    value={autor}
                    onChange={(e) => setAutor(e.target.value)}
                />

                <input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Quantidade em estoque"
                    value={estoque}
                    onChange={(e) => setEstoque(e.target.value)}
                    required
                />

                <input
                    type="url"
                    placeholder="Link do material (opcional)"
                    value={link_material}
                    onChange={(e) => setLinkMaterial(e.target.value)}
                />

                <div className="form-buttons">

                    <button
                        className="btn-primary"
                        type="submit"
                    >
                        Salvar
                    </button>

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => navigate("/materiais")}
                    >
                        Cancelar
                    </button>

                </div>

            </form>

        </div>
    );
}

export default AdicionarMaterial;
