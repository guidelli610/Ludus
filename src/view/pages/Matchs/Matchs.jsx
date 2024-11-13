import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import Header from "@components/Header";
import "./Matchs.css"
import { useNavigate } from "react-router-dom";

function Card(title, gameID) {
    return (
        <div>
            <p>{title}</p>
        </div>
    );
}

export default function Match() {
    const navigate = useNavigate();
    
    const [display, setDisplay] = useState(0);  // 0: Está mostrando os jogos atuais.
                                                // 1: Está mostrando os jogos completos.
    const [isSubmitting, setIsSubmitting] = useState(false); // Desativação do ativador para evitar envios duplicados
    const [isCreate, setIsCreate] = useState(false); // Verificação da criação da sala

    const [alertMessage, setAlertMessage] = useState(''); // Estado para a mensagem de alerta
    const [showAlert, setShowAlert] = useState(false); // Estado para controlar a visibilidade do alerta

    const [roomExist, setRoomExist] = useState(true); // Estado para controlar a visibilidade do alerta
    
    const [roomName, setRoomName] = useState('');// Nome da sala
    const [password, setPassword] = useState('');// Nome da sala

    const socketRef = useRef(null); // Referencia para o Socket
    
    useEffect(() => {
        if (!roomExist) { // Se a sala não existir, navegue
            navigate('/game', { state: { roomName: roomName, password: password } });
        }
      }, [roomExist]); // Adicione 'count' como dependência

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

            // Conexão
            socketRef.current.on("connect", () => {
                console.log("Conectado ao servidor:", socketRef.current.id);
            });

            // Recebimento de mensagens
            socketRef.current.on("exist", (exist, message) => {
                setAlertMessage(message);
                setShowAlert(exist);
                setRoomExist(exist);
                console.log("Tesst: ", exist, message);
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
            socketRef.current.off("connect");
            socketRef.current.off("exist");
            socketRef.current.off("reconnect_attempt");
            socketRef.current.off("reconnect_failed");
            socketRef.current.disconnect();
        };
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        socketRef.current.emit("doesRoomExist", roomName);
    };

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

    const renderContent = () => {
        if(display == 0) {
            return (
                <div className="gameDisplay">
                    <p>Criar uma nova partida</p>
                </div>
            )
        } else if (display == 1){
            return (
                <div className="gameDisplay">
                    <p>Criar uma sssnova partida</p>
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
                            <input type="text" id="name" name="name" onChange={(e) => setRoomName(e.target.value)} required />

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
                            <div className="dashButtons">
                                <button onClick={(e) => {setIsCreate(true)}} className={"createButton"}>Criar partida</button>
                            </div>
                            {renderContent()}
                        </div>
                    </div>
                </div>
                {newMatch()}
            </div>
        </>
    );
}