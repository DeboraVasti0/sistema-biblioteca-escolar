import { useEffect, useState } from "react";
import api from "../services/api";
import "./Dashboard.css";

function Dashboard(){

    const [dados, setDados] = useState({});


    useEffect(() => {
        api.get("dashboard/")
        .then(response => {
            setDados(response.data);
        })
        .catch(error => {
            console.log(error);
        });

    }, []);

    return (

        <div className="dashboard">

            <h1>Dashboard Biblioteca</h1>

            <div className="cards">

            <div className="card">
                    <h2>Alunos</h2>
                    <p>{dados.total_alunos}</p>
                </div>

            <div className="card">
    <h2>Materiais</h2>
    <p>{dados.total_materiais}</p>
            </div>

                <div className="card">
                    <h2>Retiradas</h2>
                    <p>{dados.total_retiradas}</p>
                </div>


                <div className="card">
                    <h2>Estoque baixo</h2>
                    <p>{dados.estoque_baixo}</p>
                </div>

            </div>

        </div>

    );
}

export default Dashboard;