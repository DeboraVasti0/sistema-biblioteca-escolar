
import { useEffect, useState } from "react";
import api from "../services/api";
import "./Page.css";

function Alunos() {
    const [alunos, setAlunos] = useState([]);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [alunoEditando, setAlunoEditando] = useState(null);

    const [nome, setNome] = useState("");
    const [ra, setRa] = useState("");
    const [turma, setTurma] = useState("");

    function carregarAlunos() {
        api.get("alunos/")
            .then(response => {
                const dados = response.data;
                setAlunos(
                    Array.isArray(dados) ? dados : dados.results || []
                );
            })
            .catch(error => {
                console.error("Erro ao carregar alunos:", error);
            });
    }

    useEffect(() => {
        carregarAlunos();
    }, []);

    function limparFormulario() {
        setNome("");
        setRa("");
        setTurma("");
        setAlunoEditando(null);
        setMostrarFormulario(false);
    }

    function salvarAluno(e) {
        e.preventDefault();

        const dados = { nome, ra, turma };

        const requisicao = alunoEditando
            ? api.patch(`alunos/${alunoEditando.id}/`, dados)
            : api.post("alunos/", dados);

        requisicao
            .then(() => {
                alert(
                    alunoEditando
                        ? "Aluno atualizado com sucesso!"
                        : "Aluno cadastrado com sucesso!"
                );

                limparFormulario();
                carregarAlunos();
            })
            .catch(error => {
                console.error("Erro ao salvar aluno:", error);

                const mensagem = error.response?.data;
                alert(
                    "Não foi possível salvar o aluno. Verifique os dados e tente novamente."
                );
                console.log("Detalhes:", mensagem);
            });
    }

    function editarAluno(aluno) {
        setAlunoEditando(aluno);
        setNome(aluno.nome);
        setRa(aluno.ra);
        setTurma(aluno.turma);
        setMostrarFormulario(true);
    }

    function excluirAluno(aluno) {
        const confirmar = window.confirm(
            `Deseja realmente excluir o aluno ${aluno.nome}?`
        );

        if (!confirmar) return;

        api.delete(`alunos/${aluno.id}/`)
            .then(() => {
                alert("Aluno excluído com sucesso!");
                carregarAlunos();
            })
            .catch(error => {
                console.error("Erro ao excluir aluno:", error);

                alert(
                    "Não foi possível excluir este aluno. Ele pode possuir retiradas registradas no histórico."
                );
            });
    }

    return (
        <div className="pagina-alunos">

            <h1>Alunos</h1>

            <button
                className="botao-adicionar"
                onClick={() => {
                    if (mostrarFormulario) {
                        limparFormulario();
                    } else {
                        setAlunoEditando(null);
                        setNome("");
                        setRa("");
                        setTurma("");
                        setMostrarFormulario(true);
                    }
                }}
            >
                {mostrarFormulario ? "Cancelar" : "+ Adicionar aluno"}
            </button>

            {mostrarFormulario && (
                <form
                    className="formulario-aluno"
                    onSubmit={salvarAluno}
                >
                    <h2>
                        {alunoEditando ? "Editar aluno" : "Novo aluno"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Nome completo"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="RA"
                        value={ra}
                        onChange={e => setRa(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Turma"
                        value={turma}
                        onChange={e => setTurma(e.target.value)}
                        required
                    />

                    <div className="acoes-aluno">
                        <button type="submit" className="botao-salvar">
                            {alunoEditando ? "Salvar alterações" : "Cadastrar aluno"}
                        </button>

                        <button
                            type="button"
                            className="botao-cancelar"
                            onClick={limparFormulario}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <h2>Lista de alunos ({alunos.length})</h2>

            <div className="lista-alunos">

                {alunos.length === 0 ? (
                    <p>Nenhum aluno cadastrado.</p>
                ) : (
                    alunos.map(aluno => (
                        <div className="card-aluno" key={aluno.id}>

                            <h2>{aluno.nome}</h2>

                            <p><strong>RA:</strong> {aluno.ra}</p>
                            <p><strong>Turma:</strong> {aluno.turma}</p>

                            <div className="acoes-aluno">
                                <button
                                    className="botao-editar"
                                    onClick={() => editarAluno(aluno)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="botao-excluir"
                                    onClick={() => excluirAluno(aluno)}
                                >
                                    Excluir
                                </button>
                            </div>

                        </div>
                    ))
                )}

            </div>
        </div>
    );
}

export default Alunos;
