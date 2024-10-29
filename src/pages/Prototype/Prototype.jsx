// Prototype.jsx
import { useEffect } from 'react';
import handleFormSubmit from './handleFormSubmit';

export default function Prototype() {
    useEffect(() => {
        handleFormSubmit(); // Chama a função de manipulação do formulário ao carregar o componente
    }, []);

    return (
        <>
            <div>
                <h1>Enviar Dados</h1>
                
                <form id="form">
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" required />

                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" name="email" required />

                    <label htmlFor="idade">Idade:</label>
                    <input type="number" id="idade" name="idade" required />

                    <label htmlFor="senha">Senha:</label>
                    <input type="text" id="senha" name="senha" required />
                    
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </>
    );
}
