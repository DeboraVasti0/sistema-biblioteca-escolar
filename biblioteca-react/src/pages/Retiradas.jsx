import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Page.css";

function Retiradas() {

    const [retiradas, setRetiradas] = useState([]);
    const [busca, setBusca] = useState("");

    const navigate = useNavigate();
    const professor = localStorage.getItem("tipo") === "professor";

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


    function carregarRetiradas() {
        api.get("retiradas/")
        .then(response => {
            setRetiradas(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        carregarRetiradas();
    }, []);


    async function registrarDevolucao(retirada) {
        const confirmar = window.confirm(
            `Confirmar a devolução de ${retirada.quantidade}x "${retirada.material_titulo}" por ${retirada.aluno_nome}?`
        );

        if (!confirmar) return;

        try {
            await api.post(`retiradas/${retirada.id}/devolver/`);
            alert("Devolução registrada! O material voltou ao estoque.");
            carregarRetiradas();
        } catch (error) {
            console.error("Erro ao registrar devolução:", error.response?.data || error);
            alert(
                "Não foi possível registrar a devolução: " +
                JSON.stringify(error.response?.data || "Erro de conexão")
            );
        }
    }


    return (
        <div>

            <h1>Retiradas</h1>


            {professor && (
                <button
                    className="btn-primary"
                    onClick={() => navigate("/nova-retirada")}
                >
                    Nova Retirada
                </button>
            )}

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

                    <p>
                        Situação:{" "}
                        {retirada.data_devolucao
                            ? `Devolvida em ${retirada.data_devolucao}`
                            : "Em aberto"}
                    </p>

                    {professor && !retirada.data_devolucao && (
                        <button
                            className="btn-primary"
                            onClick={() => registrarDevolucao(retirada)}
                        >
                            Registrar devolução
                        </button>
                    )}

                    <hr/>

                </div>

            ))}


        </div>
    );
}


export default Retiradas;
