import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import "./Message.css";

export default function Prototype() {

    const [isSubmitting, setIsSubmitting] = useState(false); // Estado do botão (ativo e inativo)

    const [message, setMessage] = useState('');
    const [messagesList, setMessagesList] = useState([]); // Estado para armazenar mensagens recebidas
    const socketRef = useRef(null); // Usamos uma ref para o socket


    useEffect(() => {
        socketRef.current = io("http://localhost:3000"); // Inicializa o socket e o armazena na ref

        const connectTimeout = setTimeout(() => {
            console.log("Conectando...");

            socketRef.current.on("connect", () => {
                console.log("Conectado ao servidor:", socketRef.current.id);
            });

            socketRef.current.on("mensagem", (data) => {
                console.log("Mensagem do servidor:", data);
                setMessagesList((prevMessages) => [...prevMessages, data]);
                setIsSubmitting(false);
            });
        }, 1000);

        // Função de limpeza: desconecta o socket ao desmontar o componente
        return () => {
            clearTimeout(connectTimeout);
            console.log("Desconectando...");
            socketRef.current.off("mensagem");
            socketRef.current.disconnect();
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (message.trim()) {
            socketRef.current.emit("mensagem", message); // Usa o socketRef para emitir a mensagem
            setMessagesList((prevMessages) => [...prevMessages, message]);
            setMessage("");
        }
    };

    return (
        <>
            <div className="all">
                <div className="dad">
                    <div className="links" style={{flex: 1}}>
                        <Link to="/prototype1" className="p_link">Registrar</Link>
                        <Link to="/prototype2" className="p_link">Login</Link>
                        <Link to="/prototype3" className="p_link">Acesso</Link>
                    </div>
                    <div className="rows" style={{flex: 10}}>
                        <div className="contact" style={{flex: 2}}>
                            <span>Teste</span>
                        </div>
                        <div className="chat"  style={{flex: 8}}>
                            <div className="message">
                                <h2>Mensagens</h2>
                                <ul>
                                    {messagesList.map((msg, index) => (
                                        <li key={index}>{msg}</li> // Renderiza a lista de mensagens
                                    ))}
                                </ul>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="call">
                                <input 
                                    type="text" 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    placeholder="Digite sua mensagem" 
                                    className="input"
                                />
                                <button type="submit" disabled={isSubmitting} className="submit">Enviar</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
