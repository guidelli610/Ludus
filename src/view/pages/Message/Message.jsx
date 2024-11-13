import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Header from "@components/Header";
import secure from "@connect/secure";
import Loading from "@pages/Loading/Loading";
import useAutoScroll from "./useAutoScroll";
import "./Message.css";

// { type: "", target: "", messagesList: [], sendersList: [], dateList: [] }

export default function Message() {

    const [senderList, setSenderList] = useState([]); // Armazenamento dos remetentes
    const [messageList, setMessageList] = useState([]); // Armazenamento das mensagens
    const [contactList, setContactList] = useState([]); // Armazenamento dos contatos
    
    const [message, setMessage] = useState(''); // Estado de mensagem
    const [roomCurrent, setRoomCurrent] = useState(''); // Estado de mensagem

    const endRef = useAutoScroll([messageList]); // Hook de scroll automático
    const socketRef = useRef(null); // Referencia para o Socket

    const identity = localStorage.getItem('identity');

    useEffect(() => {
        socketRef.current = io("http://localhost:3000", {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000
        });

        console.log("Conectando com socket...");

        const connectTimeout = setTimeout(() => {

            socketRef.current.emit('setIdentity', identity);
            changeContact('global');

            // Conexão
            socketRef.current.on("connect", () => {
                console.log("Conectado ao servidor:", socketRef.current.id);
            });

            // Recebimento de mensagens
            socketRef.current.on("message", (sender, message) => {
                console.log(`Mensagem do servidor de ${sender}:`, message);
                setMessageList( prevList => [...prevList, message]);
                setSenderList( prevList => [...prevList, sender]);
            });

            // Recebimento de mensagens
            socketRef.current.on("roomName", (roomName) => {
                console.log(`Sala conectada:`, roomName);
                setRoomCurrent(roomName);
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
            console.log("Desconectando com socket...");
            socketRef.current.off("message");
            socketRef.current.off("connect");
            socketRef.current.off("reconnect_attempt");
            socketRef.current.off("reconnect_failed");
            socketRef.current.disconnect();
        };
    }, []);

    // Envio de mensagem
    const handleSubmit = (e) => {
        e.preventDefault();
        if (message !== '' && identity !== '' && roomCurrent !== '') {
            socketRef.current.emit("getRoomUsers", roomCurrent);
            socketRef.current.emit("message", roomCurrent, message);
            setMessage(""); // Corrigido aqui
        }
    };

    // Troca de sala
    const changeContact = (target) => {
        console.log('Mudança de contato:', target);
        socketRef.current.emit('joinRoom', 'c',target);
        setMessageList([]);
        setSenderList([]);
    };

    if (secure()) { return <Loading/> } // Acesso com pedido deautenticação

    return (
        <>
            <div className="all">
                <div className="rows">
                    <div className="header">
                        <Header />
                    </div>
                    <div className="main columns">
                        <div className="message-contact message-scroll-container" style={{ flex: 2 }}>
                            {contactList.map((chat, index) => (
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
                            <div ref={endRef} />
                        </div>
                        <div className="message-chat" style={{ flex: 8 }}>
                            <div className="message-messages">
                                <div className="message-scroll-container">
                                    {messageList.map((msg, index) => (
                                            <div className="message-container" key={index}>
                                                <div
                                                    className={`message-message ${senderList[index] === identity ? 'message-you' : 'message-other'}`}
                                                >
                                                    {msg} ({senderList[index]})
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
            </div>
        </>
    );
}
