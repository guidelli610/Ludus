// Prototype.jsx
import { useEffect, useState } from 'react';
import authentication from './authentication';

export default function P3() {

    const [isSubmitting, setIsSubmitting] = useState(false);
    let authenticated = false;

    useEffect(() => {
        const form = document.getElementById('form');

        const handleSubmit = (event) => {
            event.preventDefault(); // Impede o envio padrão do formulário
            setIsSubmitting(true); // Desabilita o botão

            authenticated = authentication(setIsSubmitting); // Passa a função para lidar com o envio
            console.log(authenticated);
        };

        form.addEventListener('submit', handleSubmit);

        return () => {
            form.removeEventListener('submit', handleSubmit);
        }
    }, []);

    return (
        <>
            <div className='p_inner'>
                <span className='p_title'>Enviar/Receber Dados</span>
                
                <form id="form" className='p_form'>

                    <label htmlFor="email">Email:</label>
                    <input type="text" id="email" name="email" required />

                    <label htmlFor="password">Senha:</label>
                    <input type="text" id="password" name="password" required />

                    <label htmlFor="returner">Retorno: </label>
                    <label htmlFor="returner" id="returner">NULL</label>
                    
                    <button type="submit" disabled={isSubmitting} className='p_button'>Enviar</button>
                </form>
            </div>
        </>
    );
}
