import { useState } from "react";

export default function Prototype() {
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        idade: "",
        senha: ""
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Erro: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                alert(`Usuário criado com sucesso! ID: ${data.id}`);
            })
            .catch((error) => {
                console.error("Erro:", error);
                alert(`Ocorreu um erro ao criar o usuário.\n${error}`);
            });
    };

    return (
        <div>
            <h1>Enviar Dados</h1>
            <form id="form" onSubmit={handleSubmit}>
                <label htmlFor="nome">Nome:</label>
                <input
                    type="text"
                    id="nome"
                    name="nome"
                    required
                    value={formData.nome}
                    onChange={handleChange}
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                />

                <label htmlFor="idade">Idade:</label>
                <input
                    type="number"
                    id="idade"
                    name="idade"
                    required
                    value={formData.idade}
                    onChange={handleChange}
                />

                <label htmlFor="senha">Senha:</label>
                <input
                    type="text"
                    id="senha"
                    name="senha"
                    required
                    value={formData.senha}
                    onChange={handleChange}
                />

                <button type="submit">Enviar</button>
            </form>
        </div>
    );
}
