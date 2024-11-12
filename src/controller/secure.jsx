import { useEffect, useState } from 'react';
import secureConnection from './secureConnection.js';
import { useNavigate } from 'react-router-dom';

export default function Secure() {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Mova o useNavigate para fora da função authCheck

    useEffect(() => {
        const authCheck = async () => {
            try {
                await secureConnection(); // Aguarda a verificação
                setLoading(false); // Finaliza o processo de carregamento
            } catch (error) {
                navigate('/login', { state: { error: error } }); // Use navigate aqui
                console.log("Redirecionando para login devido a erro de autenticação");
            }
        };
        authCheck();
    }, [navigate]);

    return loading;
}
