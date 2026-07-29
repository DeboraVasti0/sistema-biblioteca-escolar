import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Page.css";

function Retiradas() {

    const [retiradas, setRetiradas] = useState([]);

    const navigate = useNavigate();


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

            <h2>Histórico de retiradas</h2>


            {retiradas.map(retirada => (

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