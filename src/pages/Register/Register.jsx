// Prototype.jsx
import { useEffect, useState } from 'react';
import registerConnection from '@connect/registerConnection';
import Header from "@components/Header";
import "@components/form.css";

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
            <div className='all'>
                <div className='rows'>
                    <div className='header'>
                        <Header/>
                    </div>
                    <div className='main center'>
                        <div className='p_inner'>
                            <span className='p_title'>Cadastro</span>
                            
                            <form id="form" className='p_form'>
                                
                                <label htmlFor="identity">Identificador:</label>
                                <input type="text" id="identity" name="identity" required />

                                <label htmlFor="name">Nome:</label>
                                <input type="text" id="name" name="name" required />

                                <label htmlFor="email">Email:</label>
                                <input type="text" id="email" name="email" required />

                                <label htmlFor="password">Senha:</label>
                                <input type="text" id="password" name="password" required />
                                
                                <button type="submit" disabled={isSubmitting} className='p_button'>Enviar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
