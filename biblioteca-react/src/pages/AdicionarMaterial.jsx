import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Page.css";

function AdicionarMaterial() {
    const [titulo, setTitulo] = useState("");
    const [tipo, setTipo] = useState("");
    const [autor, setAutor] = useState("");
    const [estoque, setEstoque] = useState("");
    const [link_material, setLinkMaterial] = useState("");

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            await api.post("materiais/", {
                titulo,
                tipo,
                autor,
                estoque,
                link_material
            });

            alert("Material adicionado com sucesso!");
            navigate("/materiais");

        } catch (error) {
            console.log("Erro ao adicionar material:", error);
            console.log(error.response?.data);
            alert("Erro ao adicionar material.");
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
            />

            <input
                type="text"
                placeholder="Autor"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
            />

            <input
                type="number"
                placeholder="Quantidade em estoque"
                value={estoque}
                onChange={(e) => setEstoque(e.target.value)}
            />

            <input
                type="text"
                placeholder="Link do material (opcional)"
                value={link_material}
                onChange={(e) => setLinkMaterial(e.target.value)}
            />

            <div className="form-buttons">

                <button className="btn-primary" type="submit">
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