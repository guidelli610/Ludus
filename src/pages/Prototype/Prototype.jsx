import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { io } from 'socket.io-client'; 
import "./Prototype.css";

const socket = io('http://localhost:3000');

export default function Prototype() {

    // Estado do botão (ativo e inativo)
    const [isSubmitting, setIsSubmitting] = useState(false); // Habilitação do botão

    const [message, setMessage] = useState('');
    const [messagesList, setMessagesList] = useState([]); // Estado para armazenar mensagens recebidas

    useEffect(() => {

        console.log('Conectando...');
        socket.on('connect', () => {
            console.log('Conectado ao servidor:', socket.id);
        });

        socket.on('mensagem', (data) => {
            console.log('Mensagem do servidor:', data);
            setMessagesList(prevMessages => [...prevMessages, data]); // Adiciona nova mensagem à lista
            setIsSubmitting(false);
        });

        return () => {
            socket.off('mensagem');
            socket.disconnect();
        };
    }, []);

    const handleSubmit = (e) => {
        setIsSubmitting(true);
        e.preventDefault();
        if (message.trim()) {
            socket.emit('mensagem', message);
            setMessagesList(prevMessages => [...prevMessages, message]); // Adiciona a mensagem enviada à lista
            setMessage('');
        }
    };

    return (
        <>
            <div className="p_links">
                <Link to="/prototype1" className="p_link">Registrar</Link>
                <Link to="/prototype2" className="p_link">Login</Link>
                <Link to="/prototype3" className="p_link">Acesso</Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="p_component">
                    <span>Mensagem: </span>
                    <div>
                        <input 
                            type="text" 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)} 
                            placeholder="Digite sua mensagem" 
                        />
                        <button type="submit" disabled={isSubmitting}>Enviar</button>
                    </div>
                </div>
            </form>

            <div className="messages">
                <h2>Mensagens</h2>
                <ul>
                    {messagesList.map((msg, index) => (
                        <li key={index}>{msg}</li> // Renderiza a lista de mensagens
                    ))}
                </ul>
            </div>
        </>
    );
}
