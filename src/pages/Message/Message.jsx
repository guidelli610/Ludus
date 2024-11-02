import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
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
        socketRef.current = io("http://localhost:3000"); // Inicializa o socket e o armazena na ref

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
            <div className="all">
                <div className="dad">
                    <div className="links" style={{flex: 2}}>
                        <Link to="/home">
                            <div className="quadrado"><img src="./icon/icon.png"/></div>
                        </Link>
                    </div>
                    <div className="rows" style={{flex: 16}}>
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
            </div>
        </>
    );
}
