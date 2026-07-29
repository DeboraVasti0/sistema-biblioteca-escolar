import { useEffect, useState } from "react";
import api from "../services/api";

function Alunos(){

    const [alunos, setAlunos] = useState([]);

    useEffect(() => {
        api.get("alunos/")
        .then(response => {
            setAlunos(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    }, []);
 

    return (
        <div>
            <h1>Alunos</h1>

            {alunos.map(aluno => (
                <div key={aluno.id}>
                    <h2>{aluno.nome}</h2>
                    <p>RA: {aluno.ra}</p>
                    <p>Turma: {aluno.turma}</p>

                    <hr/>
                </div>
            ))}

        </div>
    );
}

export default Alunos;