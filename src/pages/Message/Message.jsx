import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Header from "@components/Header";
import secure from "@connect/secure";
import Loading from "@pages/Loading/Loading";
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

            socketRef.current.on("message", (data) => {
                console.log("Mensagem do servidor:", data);
                setMessagesList((prevMessages) => [...prevMessages, data]);
                setSenderList((prevSender) => [...prevSender, 'message-other']);
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
            socketRef.current.emit("message", message); // Usa o socketRef para emitir a mensagem
            setMessagesList((prevMessages) => [...prevMessages, message]);
            setSenderList((prevSender) => [...prevSender, 'message-you']);
            setMessage("");
        }
    };


    if (secure('home')) { return <Loading/> } // Acesso com pedido deautenticação

    return (
        <>
            <div className="all rows">
                <div className="header">
                    <Header/>
                </div>
                <div className="main columns">
                    <div className="message-contact" style={{flex: 2}}>
                        <span>Teste</span>
                    </div>
                    <div className="message-chat"  style={{flex: 8}}>
                        <div className="message-messages">
                            <div className="message-scroll-container">
                                {messagesList.map((msg, index) => (
                                    <div className="message-container">
                                        <div key={index} className={`message-message ${senderList[index]}`}>{msg} ({senderList[index]})</div>
                                    </div>
                                ))}
                                <div ref={endRef}/>
                            </div>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="message-call">
                            <input
                                type="text" 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)} 
                                placeholder="Digite sua mensagem" 
                                className="message-input"
                            />
                            <button type="submit" disabled={isSubmitting} className="message-submit">Enviar</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
