// Prototype.jsx
import { useEffect, useState } from 'react';
import registerConnection from '@connect/registerConnection';

export default function Register() {

    // ----------------------------------[Ativação do Register]------------------------------------- //

    // consideração da importação -> import registerConnection from '@connect/registerConnection';

    const [isSubmitting, setIsSubmitting] = useState(false); // Desativação do ativador para evitar envios duplicados
    
    useEffect(() => {
        const form = document.getElementById('form');

        const handleSubmit = (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário
            setIsSubmitting(true); // Desabilita o botão

            registerConnection(setIsSubmitting); // Passa a função para lidar com o envio
        };

        form.addEventListener('submit', handleSubmit) // Considera um evento para ativação

        // elemento exemplar -> <button type="submit" disabled={isSubmitting} className='p_button'>Enviar</button>

        return () => {
            form.removeEventListener('submit', handleSubmit)
        }
    }, []);

    // --------------------------------------------------------------------------------------------- //

    return (
        <>
            <div className='p_inner'>
                <span className='p_title'>Enviar Dados</span>
                
                <form id="form" className='p_form'>
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" required />

                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" name="email" required />

                    <label htmlFor="senha">Senha:</label>
                    <input type="text" id="senha" name="senha" required />
                    
                    <button type="submit" disabled={isSubmitting} className='p_button'>Enviar</button>
                </form>
            </div>
        </>
    );
}
