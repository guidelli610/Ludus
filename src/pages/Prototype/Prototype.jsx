import "./run"

export default function Prototype(){
    return (
        <>
            <div>
                <h1>Enviar Dados</h1>
                
                <form id="form">
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" required />

                    <label for="email">Email:</label>
                    <input type="text" id="email" name="email" required />
                    
                    <label for="idade">Idade:</label>
                    <input type="number" id="idade" name="idade" required />

                    <label for="senha">Senha:</label>
                    <input type="text" id="senha" name="senha" required />
                    
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </>
    );
}