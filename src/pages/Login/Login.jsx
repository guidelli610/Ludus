// Prototype.jsx
import { useEffect, useState, useNavigate } from 'react';
import loginConnection from '@connect/loginConnection';
import "@components/form.css";
import Header from "@components/Header";

export default function Login() {

    // Estado do botão (ativo e inativo)
    const [isSubmitting, setIsSubmitting] = useState(false); // Habilitação do botão

    const [alertMessage, setAlertMessage] = useState(''); // Estado para a mensagem de alerta
    const [showAlert, setShowAlert] = useState(false); // Estado para controlar a visibilidade do alerta
    
    //useEffect executa na criação de Login
    useEffect(() => {
        const form = document.getElementById('form');


        const handleSubmit = (event) => {
            event.preventDefault(); // Impede a página regarregar
            setIsSubmitting(true); // Desabilita o botão

            loginConnection(setIsSubmitting, setAlertMessage, setShowAlert); // Passa a função para lidar com o envio
        };

        form.addEventListener('submit', handleSubmit);

        return () => {
            form.removeEventListener('submit', handleSubmit);
        }
    }, []);

    return (
        <>
            <div className='all'>
                <div className='rows'>
                    <div className='header'>
                        <Header/>
                    </div>
                    <div className='main center'>
                        <div className='p_inner'>
                            <span className='p_title'>Enviar/Receber Dados</span>                            
                            <form id="form" className='p_form'>

                                {showAlert && (
                                    <div className='p_alert p_alert-danger'>{alertMessage}</div>
                                )}

                                <label htmlFor="email">Email:</label>
                                <input type="text" id="email" name="email" required />

                                <label htmlFor="password">Senha:</label>
                                <input type="text" id="password" name="password" required />
                                
                                <button type="submit" disabled={isSubmitting} className='p_button'>
                                    {isSubmitting ? 'Enviando...' : 'Login'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
