// Prototype.jsx
import { useEffect, useState } from 'react';
import handleFormSubmit from './handleFormSubmit';

export default function P2() {

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
                <span className='p_title'>Receber Dados</span>
                
                <form id="form" className='p_form'>

                    <label htmlFor="return">Retorno: </label>
                    <span id="retorn">NULL</span>
                    
                    <button type="submit" disabled={isSubmitting} className='p_button'>Enviar</button>
                </form>
            </div>
        </>
    );
}
