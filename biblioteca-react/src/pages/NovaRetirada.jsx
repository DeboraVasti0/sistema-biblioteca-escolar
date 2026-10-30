
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Page.css";

function NovaRetirada() {
    const [alunos, setAlunos] = useState([]);
    const [materiais, setMateriais] = useState([]);

    const [aluno, setAluno] = useState("");
    const [material, setMaterial] = useState("");
    const [quantidade, setQuantidade] = useState("1");

    const [carregando, setCarregando] = useState(true);

    const navigate = useNavigate();

    // Carregar alunos e materiais
    useEffect(() => {
        async function carregarDados() {
            try {
                const [resAlunos, resMateriais] = await Promise.all([
                    api.get("alunos/"),
                    api.get("materiais/")
                ]);

                const dadosAlunos =
                    resAlunos.data.results ?? resAlunos.data;

                const dadosMateriais =
                    resMateriais.data.results ?? resMateriais.data;

                setAlunos(Array.isArray(dadosAlunos) ? dadosAlunos : []);
                setMateriais(
                    Array.isArray(dadosMateriais) ? dadosMateriais : []
                );

            } catch (error) {
                console.error(
                    "Erro ao carregar dados:",
                    error.response?.data || error
                );

                alert("Não foi possível carregar alunos e materiais.");

            } finally {
                setCarregando(false);
            }
        }

        carregarDados();
    }, []);

    // Realizar retirada
    async function handleSubmit(e) {
        e.preventDefault();

        const quantidadeNumero = Number(quantidade);

        if (!aluno || !material) {
            alert("Selecione um aluno e um material.");
            return;
        }

        if (
            !Number.isInteger(quantidadeNumero) ||
            quantidadeNumero < 1
        ) {
            alert("Informe uma quantidade válida.");
            return;
        }

        // Verificar estoque disponível
        const materialSelecionado = materiais.find(
            (m) => String(m.id) === String(material)
        );

        if (!materialSelecionado) {
            alert("Material não encontrado.");
            return;
        }

        if (quantidadeNumero > Number(materialSelecionado.estoque)) {
            alert(
                `Estoque insuficiente. Disponível: ${materialSelecionado.estoque}`
            );
            return;
        }

        try {
            await api.post("retiradas/", {
                aluno: Number(aluno),
                material: Number(material),
                quantidade: quantidadeNumero
            });

            alert("Retirada realizada com sucesso!");

            navigate("/retiradas");

        } catch (error) {
            console.error(
                "Erro ao realizar retirada:",
                error.response?.data || error
            );

            const mensagem = error.response?.data
                ? JSON.stringify(error.response.data)
                : "Verifique a conexão com o servidor.";

            alert("Erro ao realizar retirada:\n" + mensagem);
        }
    }

    return (
        <div className="page">

            <h1>Nova Retirada</h1>

            {carregando ? (
                <p>Carregando informações...</p>
            ) : (
                <form
                    className="form-material"
                    onSubmit={handleSubmit}
                >

                    <select
                        value={aluno}
                        onChange={(e) => setAluno(e.target.value)}
                        required
                    >
                        <option value="">Selecione o aluno</option>

                        {alunos.map((a) => (
                            <option key={a.id} value={a.id}>
                                {a.nome}
                            </option>
                        ))}
                    </select>

                    <select
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        required
                    >
                        <option value="">Selecione o material</option>

                        {materiais.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.titulo} — Estoque: {m.estoque}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        min="1"
                        step="1"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        placeholder="Quantidade"
                        required
                    />

                    <div className="form-buttons">

                        <button
                            className="btn-primary"
                            type="submit"
                            disabled={
                                alunos.length === 0 ||
                                materiais.length === 0
                            }
                        >
                            Confirmar Retirada
                        </button>

                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate("/retiradas")}
                        >
                            Cancelar
                        </button>

                    </div>

                </form>
            )}

        </div>
    );
}

export default NovaRetirada;
