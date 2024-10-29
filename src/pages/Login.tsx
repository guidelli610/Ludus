import React, { FormEvent } from "react";

export default function Login () {
    
    const authenticate = (e: FormEvent<HTMLInputElement>) => {
        e.preventDefault();
        console.log("AAAA");
    }

    return(
        <>
            <h1>Enviar Dados</h1>
            <form id="form" onSubmit={() => authenticate}>
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
        </>
    );
}