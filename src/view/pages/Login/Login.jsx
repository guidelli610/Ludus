import { useEffect, useState } from 'react';
import loginConnection from '@connect/loginConnection';
import Header from "@components/Header";
import { useLocation } from "react-router-dom";

export default function Login() {
    // Estado do botão (ativo e inativo)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [alertMessage, setAlertMessage] = useState(''); // Estado para a mensagem de alerta
    const [showAlert, setShowAlert] = useState(false); // Estado para controlar a visibilidade do alerta

    const location = useLocation();

    //useEffect executa na criação de Login
    useEffect(() => {
        // Verifica se `location.state?.error` é um objeto `Error` e extrai a mensagem
        const alert = location.state?.error;
        if (alert instanceof Error) {
            setAlertMessage(alert.message); // Extrai a mensagem do erro
            setShowAlert(true);
        } else if (alert) {
            setAlertMessage(alert); // Caso `alert` seja uma string
            setShowAlert(true);
        }

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
        
    }, [location.state]);

    return (
        <>
            <div className='all'>
                <div className='rows'>
                    <div className='header'>
                        <Header/>
                    </div>
                    <div className='main center'>
                        <div className='form'>
                            <span className='title'>Enviar/Receber Dados</span>                            
                            <form id="form" className='rows' style={{gap: '5px'}}>

                                {showAlert && (
                                    <div className='alert alert-danger'>{alertMessage}</div>
                                )}

                                <label htmlFor="email">Email:</label>
                                <input type="text" id="email" name="email" required />

                                <label htmlFor="password">Senha:</label>
                                <input type="text" id="password" name="password" required />
                                
                                <button type="submit" disabled={isSubmitting} className='button'>
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
