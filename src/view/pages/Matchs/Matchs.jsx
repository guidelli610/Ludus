import React, { useState, useContext, useEffect } from 'react';
import { SocketContext } from '@controller/SocketProvider';
import Header from "@components/Header";
import "./Matchs.css"
import { useNavigate } from "react-router-dom";

export default function Match() {
    const navigate = useNavigate();
    
    const [display, setDisplay] = useState(0);  // 0: Está mostrando os jogos publicos.
                                                // 1: Está mostrando os jogos privados.
    const [isSubmitting, setIsSubmitting] = useState(false); // Desativação do ativador para evitar envios duplicados
    const [isCreate, setIsCreate] = useState(false); // Verificação da criação da sala
    const [needPassword, setNeedPassword] = useState(false); // Verificação da criação da sala

    const [alertMessage, setAlertMessage] = useState(''); // Estado para a mensagem de alerta
    const [showAlert, setShowAlert] = useState(false); // Estado para controlar a visibilidade do alerta
    const [jump, setJump] = useState(false); // Estado para controlar a visibilidade do alerta

    const [name, setName] = useState('');// Nome da sala
    const [password, setPassword] = useState('');// Nome da sala

    const [publicRooms, setPublicRooms] = useState([]);
    const [privateRooms, setPrivateRooms] = useState([]);

    const { socket, connected, error } = useContext(SocketContext);

    useEffect(() => {
        if (jump) {
            navigate('/game', { state: { name: name, password: password} });
        }
    }, [jump])

    useEffect(() => {
        if (!socket) return; // Proteção contra socket nulo

        socket.emit('roomList');

        // Recebimento de mensagens
        socket.on("sucess", (sucess, message='') => {
            console.log("Sucess: ", sucess, message);
            setAlertMessage(message);
            setShowAlert(!sucess);
            setJump(sucess);
        });
        
        // Ouvir por mensagens do servidor
        socket.on('roomList', (publicRooms, privateRooms) => {
            setPublicRooms(publicRooms);
            setPrivateRooms(privateRooms);
        });

        return () => {
            socket.off("sucess");
            socket.off("roomList");
        };
    }, [socket]);
    
    const renderTabBar = () => {
        if(display == 0) {
            return (
                <div className="dashButtons">
                    <button value={0} onClick={(e) => {setDisplay(e.target.value)}} className={"dashButton selected"}>Jogos públicos</button>
                    <button value={1} onClick={(e) => {setDisplay(e.target.value)}} className={"dashButton"}>Jogos privados</button>
                </div>
            );
        } else if (display == 1){
            return (
                <div className="dashButtons">
                    <button value={0} onClick={(e) => {setDisplay(e.target.value)}} className={"dashButton"}>Jogos públicos</button>
                    <button value={1} onClick={(e) => {setDisplay(e.target.value)}} className={"dashButton selected"}>Jogos privados</button>
                </div>
            );
        }
    }
    
    const handleButtonMatchClick = () => {
        console.log("MatchsCLick", name, password);
        socket.emit('joinRoom', 'd', name, password);
    };

    const handleButtonMatchPublicClick = (name) => {
        setName(name);
        console.log("MatchsCLick", name, password);
        socket.emit('joinRoom', 'd', name, password);
    };


    const newNeedPassword = () => {
        if (needPassword){
            return (
                <div className="center createStyle">
                    <div className='form'>
                        <span className='title'>Senha</span>
                        
                        <form id="form" className='rows' style={{gap: '5px'}}>
                            {showAlert && (
                                <div className='alert alert-danger'>{alertMessage}</div>
                            )}

                            {havePassword()}
                            
                            <button type="submit" disabled={isSubmitting} onClick={() => {handleButtonMatchClick; setNeedPassword(false)}} className='button'>
                                {isSubmitting ? 'Criando...' : 'Criar'}
                            </button>
                            <button onClick={setNeedPassword(false)} disabled={isSubmitting} className='button'>Sair</button>
                        </form>
                    </div>
                </div>
            );
        }
    }

    const renderContent = () => {
        if(display == 0) {
            return (
                <div className="gameDisplay">
                    {publicRooms.map((room, index) => (
                    <button key={room.key} value={room.key} onClick={(e) => {handleButtonMatchPublicClick(e.target.value);}} className={"matchButton"}>{room.name}</button>
                    ))}
                </div>
            )
        } else if (display == 1){
            return (
                <div className="gameDisplay">
                    {privateRooms.map((room, index) => (
                    <button key={room.key} value={room.key} onClick={(e) => {setName(e.target.value); setNeedPassword(true);}} className={"matchButton"}>{room.name}</button>
                    ))}
                </div>
            );
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("CreateCLick", name);
        socket.emit("createRoom", 'g', name, password);
    };

    const newMatch = () => {
        if (isCreate){
            return (
                <div className="center createStyle">
                    <div className='form'>
                        <span className='title'>Sala</span>
                        
                        <form id="form" className='rows' style={{gap: '5px'}} onSubmit={handleSubmit}>
                            {showAlert && (
                                <div className='alert alert-danger'>{alertMessage}</div>
                            )}
                            
                            <label htmlFor="name">Nome da sala:</label>
                            <input type="text" id="name" name="name" onChange={(e) => setName(e.target.value)} required />

                            {havePassword()}
                            
                            <button type="submit" disabled={isSubmitting} className='button'>
                                {isSubmitting ? 'Criando...' : 'Criar'}
                            </button>
                            <button onClick={(e) => {setIsCreate(false)}} disabled={isSubmitting} className='button'>Sair</button>
                        </form>
                    </div>
                </div>
            );
        }
    }

    const havePassword = () => {
        if (display == 1){
            return (
                <>
                    <label htmlFor="password">Senha:</label>
                    <input type="text" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                </>
            );
        }
    }

    return (
        <>
            <div className='all' style={{ position: 'relative' }}> 
                <div className='rows'>
                    <div className='header'>
                        <Header/>
                    </div>
                    <div className='center'>
                        <div className='dashBoard fullDash'>
                            {renderTabBar()}
                            <button onClick={(e) => {setIsCreate(true)}} className={"createButton"}>Criar partida</button>
                            {renderContent()}
                        </div>
                    </div>
                </div>
                {newMatch()}
                {newNeedPassword()}
            </div>
        </>
    );
}