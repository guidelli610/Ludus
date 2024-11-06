import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Header from "@components/Header";
import secure from "@connect/secure";
import Loading from "@pages/Loading/Loading";
import useAutoScroll from "./useAutoScroll";
import "./Message.css";
import chatManager from "./chatManager";

export default function Prototype() {
    const CM = new chatManager();
    const CMRef = useRef(CM);

    const [chatsList, setChatsList] = useState(CM.getChatsList()); // Armazenamento dos chatsList
    
    const [message, setMessage] = useState(''); // Estado de mensagem
    const [currentRoom, setCurrentRoom] = useState(''); // Estado do quarto atual

    const endRef = useAutoScroll([chatsList]); // Hook de scroll automático
    const socketRef = useRef(null); // Referencia para o Socket
    
    const identity = localStorage.getItem('identity');

    function Show () {
        // Show
        console.log("_______________[Show]________________");
        console.log("CM: ", CM);
        console.log("chatList: ", chatsList);
        console.log("isSubmitting: ", isSubmitting);
        console.log("currentRoom: ", currentRoom);
        console.log("chatsList: ", chatsList);
        console.log("EndRef: ", endRef);
        console.log("socketRef: ", socketRef);
        console.log("identity: ", identity);
        console.log("_____________________________________");
    }

    useEffect(() => {
        socketRef.current = io("http://localhost:3000", {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000
        });

        const connectTimeout = setTimeout(() => {
            console.log("Conectando...");

            changeContact('room_global');

            // Conexão
            socketRef.current.on("connect", () => {
                console.log("Conectado ao servidor:", socketRef.current.id);
            });

            // Recebimento de mensagens
            socketRef.current.on("message", (sender, message, room) => {
                console.log(`Mensagem do servidor de ${sender}:`, message);
                CMRef.current.sendMessage(room, sender, message);
                setChatsList(CMRef.current.getChatsList());
            });

            // Reconexão
            socketRef.current.on("reconnect_attempt", (attempt) => {
                console.log(`Tentativa de reconexão #${attempt}`);
            });

            // Falha da reconexão
            socketRef.current.on("reconnect_failed", () => {
                console.log("Falha ao reconectar. Atualizando a página...");
                location.reload();
            });

        }, 500);

        return () => {
            clearTimeout(connectTimeout);
            console.log("Desconectando...");
            socketRef.current.off("mensagem");
            socketRef.current.disconnect();
        };
    }, []); // Quando o `currentRoom` mudar, a conexão será atualizada <- Alerta

    // Envio de mensagem
    const handleSubmit = (e) => {
        e.preventDefault();
        if (message !== '' && currentRoom !== '') {
            socketRef.current.emit("message", identity, message, currentRoom);
            CMRef.current.sendMessage(currentRoom, identity, message);
            setChatsList(CMRef.current.getChatsList());
            setMessage(""); // Corrigido aqui
        }
    };

    // Troca de sala
    const changeContact = (target) => {
        console.log('Mudança de contato: ', identity, target);
        socketRef.current.emit('joinRoom', identity, target, setCurrentRoom);
        setChatsList(CMRef.current.getChatsList());
    };

    return (
        <>
            <div className="all rows">
                <div className="header">
                    <Header />
                </div>
                <div className="main columns">
                    <div className="message-contact message-scroll-container" style={{ flex: 2 }}>
                        {chatsList.map((chat, index) => (
                            <div className="message-container" key={index}>
                                <button
                                    type="button"
                                    className="message-button"
                                    onClick={() => changeContact(chat.room)}
                                >
                                    {chat.room}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="message-chat" style={{ flex: 8 }}>
                        <div className="message-messages">
                            <div className="message-scroll-container">
                                {chatsList
                                    .find(chat => chat.room === currentRoom)
                                    ?.messagesList.map((msg, index) => (
                                        <div className="message-container" key={index}>
                                            <div
                                                className={`message-message ${chatsList
                                                    .find(chat => chat.room === currentRoom)
                                                    ?.sendersList[index] === identity ? 'message-you' : 'message-other'}`}
                                            >
                                                {msg} ({chatsList
                                                    .find(chat => chat.room === currentRoom)
                                                    ?.sendersList[index]})
                                            </div>
                                        </div>
                                    ))}
                                <div ref={endRef} />
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
                            <button type="submit" className="message-submit">
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
