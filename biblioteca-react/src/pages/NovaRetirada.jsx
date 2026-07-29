import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Page.css";

function NovaRetirada() {

    const [alunos, setAlunos] = useState([]);
    const [materiais, setMateriais] = useState([]);

    const [aluno, setAluno] = useState("");
    const [material, setMaterial] = useState("");
    const [quantidade, setQuantidade] = useState(1);

    const navigate = useNavigate();

    useEffect(() => {

        api.get("alunos/")
            .then(response => {
                setAlunos(response.data);
            });

        api.get("materiais/")
            .then(response => {
                setMateriais(response.data);
            });

    }, []);

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            await api.post("retiradas/", {
                aluno,
                material,
                quantidade,
                data_retirada: new Date().toISOString().split("T")[0]
            });

            alert("Retirada realizada com sucesso!");

            navigate("/retiradas");

        } catch (error) {
    console.log(error);

    if (error.response) {
        console.log(error.response.data);
        alert(JSON.stringify(error.response.data));
    } else {
        alert(error.message);
    }
}
    }

return (
    <div className="page">

        <h1>Nova Retirada</h1>

        <form className="form-material" onSubmit={handleSubmit}>

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
                        {m.titulo}
                    </option>
                ))}
            </select>

            <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                placeholder="Quantidade"
                required
            />

            <div className="form-buttons">

                <button
                    className="btn-primary"
                    type="submit"
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

    </div>
);

}

export default NovaRetirada;