import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Page.css";

function Retiradas() {

    const [retiradas, setRetiradas] = useState([]);
    const [busca, setBusca] = useState("");

    const navigate = useNavigate();

    const retiradasFiltradas = retiradas.filter((retirada) =>
        [
            retirada.aluno_nome,
            retirada.material_titulo,
            retirada.data_retirada,
            retirada.quantidade
        ].some((valor) =>
            String(valor ?? "").toLowerCase().includes(busca.trim().toLowerCase())
        )
    );


    useEffect(() => {

        api.get("retiradas/")
        .then(response => {
            setRetiradas(response.data);
        })
        .catch(error => {
            console.log(error);
        });

    }, []);


    return (
        <div>

            <h1>Retiradas</h1>


         <button
        className="btn-primary"
        onClick={() => navigate("/nova-retirada")}>
        
        Nova Retirada
        
        </button>

            <input
                className="barra-pesquisa"
                type="search"
                placeholder="Pesquisar por aluno, material ou data..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />

            <h2>Histórico de retiradas</h2>


            {retiradasFiltradas.length === 0 ? (
                <p>Nenhuma retirada encontrada.</p>
            ) : retiradasFiltradas.map(retirada => (

                <div key={retirada.id}>

                    <p>
                        Aluno:{retirada.aluno_nome}
                    </p>

                    <p>
                        Material: {retirada.material_titulo}
                    </p>

                    <p>
                        Quantidade: {retirada.quantidade}
                    </p>

                    <p>
                        Data: {retirada.data_retirada}
                    </p>

                    <hr/>

                </div>

            ))}


        </div>
    );
}


export default Retiradas;