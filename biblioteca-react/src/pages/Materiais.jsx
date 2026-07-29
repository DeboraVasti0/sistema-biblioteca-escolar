import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Page.css";

function Materiais() {

    const [materiais, setMateriais] = useState([]);
    const [busca, setBusca] = useState("");

    const navigate = useNavigate();


    function carregarMateriais() {
        api.get("materiais/")
            .then(response => {
                setMateriais(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }


    useEffect(() => {
        carregarMateriais();
    }, []);


    const materiaisFiltrados = materiais.filter((material) =>
        material.titulo?.toLowerCase().includes(busca.toLowerCase())
    );


    async function excluirMaterial(id) {
        if (window.confirm("Deseja excluir este material?")) {
            try {
                await api.delete(`materiais/${id}/`);
                carregarMateriais();
            } catch (error) {
                console.log(error);
            }
        }
    }


    async function editarMaterial(material) {

        const titulo = prompt("Novo título:", material.titulo);
        const autor = prompt("Novo autor:", material.autor);
        const estoque = prompt("Novo estoque:", material.estoque);

        try {
            await api.patch(`materiais/${material.id}/`, {
                titulo: titulo,
                autor: autor,
                estoque: estoque
            });

            alert("Material atualizado!");
            carregarMateriais();

        } catch(error) {
            console.log(error.response?.data);
        }
    }


    return (
        <div>

            <h1>Materiais</h1>

            <input
                className="barra-pesquisa"
                type="text"
                placeholder="🔍 Pesquisar material..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />


            <br /><br />


            <button
                className="btn-primary"
                onClick={() => navigate("/adicionar-material")}
            >
                Adicionar material
            </button>



            {materiaisFiltrados.map((material) => (
                <div key={material.id}>

                    <h2>{material.titulo}</h2>

                    <p>Autor: {material.autor}</p>

                    <p>Estoque: {material.estoque}</p>


                    {material.link_material && (
                        <a
                            href={material.link_material}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Acessar material
                        </a>
                    )}


                    <br /><br />


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


                    <hr />

                </div>
            ))}


        </div>
    );
}

export default Materiais;