import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Header from "@components/Header";
import useAutoScroll from "./useAutoScroll"
import "./Message.css";

export default function Prototype() {

    const [isSubmitting, setIsSubmitting] = useState(false); // Estado do botão (ativo e inativo)

    const [message, setMessage] = useState('');
    const [messagesList, setMessagesList] = useState([]); // Estado para armazenar mensagens recebidas
    const [senderList, setSenderList] = useState([]);
    
    const endRef = useAutoScroll([messagesList]); // Hook de scroll automático
    const socketRef = useRef(null); // Usamos uma ref para o socket


    useEffect(() => {
        socketRef.current = io("http://localhost:3000", {
            reconnection: true, // Habilita a reconexão automática
            reconnectionAttempts: 5, // Número máximo de tentativas de reconexão
            reconnectionDelay: 1000, // Tempo (em ms) antes de tentar reconectar (1 segundo)
            reconnectionDelayMax: 5000, // Tempo máximo (em ms) para as tentativas de reconexão (5 segundos)
            timeout: 20000 // Tempo de espera para conexão inicial (20 segundos)
        });

        const connectTimeout = setTimeout(() => {
            console.log("Conectando...");

            socketRef.current.on("connect", () => {
                console.log("Conectado ao servidor:", socketRef.current.id);
            });

            socketRef.current.on("mensagem", (data) => {
                console.log("Mensagem do servidor:", data);
                setMessagesList((prevMessages) => [...prevMessages, data]);
                setSenderList((prevSender) => [...prevSender, 'other']);
            });

            socketRef.current.on("reconnect_attempt", (attempt) => {
                console.log(`Tentativa de reconexão #${attempt}`);
            });
            
            socketRef.current.on("reconnect_failed", () => {
                console.log("Falha ao reconectar. Atualizando a página...");
                location.reload(); // Recarrega a página para forçar nova conexão
            });
        }, 500);

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

        if (message.trim()) {
            socketRef.current.emit("mensagem", message); // Usa o socketRef para emitir a mensagem
            setMessagesList((prevMessages) => [...prevMessages, message]);
            setSenderList((prevSender) => [...prevSender, 'you']);
            setMessage("");
        }
    };

    return (
        <>
            <div className="all rows">
                <div className="header">
                    <Header/>
                </div>
                <div className="main columns">
                    <div className="contact" style={{flex: 2}}>
                        <span>Teste</span>
                    </div>
                    <div className="chat"  style={{flex: 8}}>
                        <div className="messages">
                            <div className="scroll-container">
                                {messagesList.map((msg, index) => (
                                    <div className="container-message">
                                        <div key={index} className={`message ${senderList[index]}`}>{msg} ({senderList[index]})</div>
                                    </div>
                                ))}
                                <div ref={endRef}/>
                            </div>
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
        </>
    );
}
