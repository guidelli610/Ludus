// Prototype.jsx
import { useEffect, useState } from 'react';
import secureConnection from './secureConnection.js';

export default function secure(routeEscape) {

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const authCheck = async () => {
            try {
                await secureConnection(); // Aguarda a verificação
                setLoading(false); // Finaliza o processo de carregamento
            } catch (error) {
                window.location.href = routeEscape;
            }
        };
        authCheck();
    }, []);

    return loading;
}
