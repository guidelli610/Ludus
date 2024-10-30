// Prototype.jsx
import { useEffect, useState } from 'react';
import handleFormSubmit from './handleFormSubmit';

export default function P1() {

    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        const form = document.getElementById('form');

        const handleSubmit = (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário
            setIsSubmitting(true); // Desabilita o botão

            handleFormSubmit(setIsSubmitting); // Passa a função para lidar com o envio
        };

        form.addEventListener('submit', handleSubmit)

        return () => {
            form.removeEventListener('submit', handleSubmit)
        }
    }, []);

    return (
        <>
            <div className='p_inner'>
                <span className='p_title'>Enviar Dados</span>
                
                <form id="form" className='p_form'>
                    <label htmlFor="nome">Nome:</label>
                    <input type="text" id="nome" name="nome" required />

                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" name="email" required />

                    <label htmlFor="idade">Data de nascimento:</label>
                    <input type="date" id="date" name="date"/>

                    <label htmlFor="senha">Senha:</label>
                    <input type="text" id="senha" name="senha" required />
                    
                    <button type="submit" disabled={isSubmitting} className='p_button'>Enviar</button>
                </form>
            </div>
        </>
    );
}
