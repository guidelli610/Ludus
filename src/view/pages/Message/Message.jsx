import React, { useState, useContext, useEffect, useRef } from 'react';
import { SocketContext } from '@controller/SocketProvider';
import { v4 as uuidv4 } from 'uuid';
import Header from "@components/Header";
import secure from "@connect/secure";
import Loading from "@pages/Loading/Loading";
import useAutoScroll from "./useAutoScroll";
import "./Message.css";

export default function Message() {
    const { socket, connected, error } = useContext(SocketContext);
    const [messageList, setMessageList] = useState([]);
    const [contactList, setContactList] = useState([]);
    const [message, setMessage] = useState('');
    const endRef = useAutoScroll([messageList]);
    const identity = localStorage.getItem('identity');
    const messageEndRef = useRef(null);

    useEffect(() => {
        if (!socket) return; // Proteção contra socket nulo

        const messageHandler = (sender, message) => {
            setMessageList(prevList => [...prevList, { message, sender, id: uuidv4() }]);
            // Scroll para baixo após nova mensagem
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };

        socket.on("message", messageHandler);
        changeContact('d','global');

        return () => {
            socket.off("message", messageHandler); // Remova o listener corretamente
        };
    }, [socket]); // Dependencias atualizadas


    const handleSubmit = (e) => {
        e.preventDefault();
        if (message !== '') {
            socket.emit("message", message);
            setMessage("");
        }
    };

    const changeContact = (type, target) => {
        console.log('Mudança de contato:', target);
        socket.emit('create&joinRoom', type, target); // Removido o 'd'
        setMessageList([]);
    };

    if (secure()) { return <Loading/>; }

    if (error) {
        return <div>Erro: {error.message}</div>;
    }

    if (!connected) {
        return <div>Conectando...</div>;
    }

    return (
        <>
            <div className="all">
                <div className="rows">
                    <div className="header">
                        <Header />
                    </div>
                    <div className="main columns">
                        <div className="message-contact message-scroll-container" style={{ flex: 2 }}>
                            {contactList.map((chat) => (
                                <div className="message-container" key={chat.id}> {/* Aqui está a chave! */}
                                    <button
                                        type="button"
                                        className="message-button"
                                        onClick={() => changeContact(chat.type, chat.target)}  // Corrigido para usar os campos corretos
                                    >
                                        {chat.target} {/*  Ajuste se necessário para exibir o nome do contato */}
                                    </button>
                                </div>
                            ))}
                            <div ref={endRef} />
                        </div>
                        <div className="message-chat" style={{ flex: 8 }}>
                            <div className="message-messages">
                                <div className="message-scroll-container">
                                    {messageList.map((msg, index) => (
                                        <div className="message-container" key={msg.id}> {/* Usando messageId ou timestamp como chave */}
                                            <div
                                                className={`message-message ${msg.sender === identity ? 'message-you' : 'message-other'}`}
                                            >
                                                {msg.message} ({msg.sender})
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