import { useEffect, useState, useRef, useContext } from "react";
import { SocketContext } from '@controller/SocketProvider';
import { useLocation, useNavigate } from "react-router-dom";
import React from 'react';
import "./Game.css";
import Loading from "@pages/Loading/Loading";
import { faChessBishop } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Game() {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, password } = location.state || {};

    const [fail, setFail] = useState(false); // Estado para controlar a visibilidade do alerta

    const [senderList, setSenderList] = useState([]); // Armazenamento dos remetentes
    const [messageList, setMessageList] = useState([]); // Armazenamento das mensagens
    const [isLoading, setIsLoading] = useState(true);

    const { socket, connected, error } = useContext(SocketContext);

    useEffect(() => {

        if (!socket) return; // Proteção contra socket nulo

        if (name === undefined){
            navigate('/matchs', { state: { error: true, message: "Falha de criação de sala!"} });
        } else {
            setIsLoading(false);
        }

        // Recebimento de mensagens
        socket.on("message", (sender, message) => {
            console.log(`Mensagem do servidor de ${sender}:`, message);
            setMessageList( prevList => [...prevList, message]);
            setSenderList( prevList => [...prevList, sender]);
        });

        return () => {
            socket.off("message");
        };
    }, []);

    const [board, updateBoard] = useState([ // Isso vai cobrir o estado em relação as peças. 
        [
            {tipo: 'T', cor: 1}, // 1 = branco, 0 = preto.
            {tipo: 'C', cor: 1},
            {tipo: 'B', cor: 1},
            {tipo: 'Ra', cor: 1},
            {tipo: 'Re', cor: 1},
            {tipo: 'B', cor: 1}, // Sê vc ler os tipos desses ultimos três fica BCT hihihihihihihhi
            {tipo: 'C', cor: 1}, 
            {tipo: 'T', cor: 1} 
        ],
        [
            {tipo: 'P', cor: 1},
            {tipo: 'P', cor: 1},
            {tipo: 'P', cor: 1},
            {tipo: 'P', cor: 1},
            {tipo: 'P', cor: 1},
            {tipo: 'P', cor: 1},
            {tipo: 'P', cor: 1},
            {tipo: 'P', cor: 1}
        ],
        [
            {},{},{},{},{},{},{},{}
        ],
        [
            {},{},{},{},{},{},{},{}
        ],
        [
            {},{},{},{},{},{},{},{}
        ],
        [
            {},{},{},{},{},{},{},{}
        ],
        [
            {tipo: 'P', cor: 0},
            {tipo: 'P', cor: 0},
            {tipo: 'P', cor: 0},
            {tipo: 'P', cor: 0},
            {tipo: 'P', cor: 0},
            {tipo: 'P', cor: 0},
            {tipo: 'P', cor: 0},
            {tipo: 'P', cor: 0}
        ],
        [
            {tipo: 'T', cor: 0},
            {tipo: 'C', cor: 0},
            {tipo: 'B', cor: 0},
            {tipo: 'Ra', cor: 0},
            {tipo: 'Re', cor: 0},
            {tipo: 'B', cor: 0},
            {tipo: 'C', cor: 0}, 
            {tipo: 'T', cor: 0}
        ],
    ]);

    const renderRows = () => {
        return (
            board.map((row, indexY) => {
                return (
                    <div key={indexY} style={{ width: '100%', height: '100%', display: 'grid', gridAutoFlow: 'column'}}>
                        {renderColumns(row, indexY)}
                    </div>
                );
            })
        );
    }

    const renderColumns = (row, indexY) => {
        const styleBlack = { backgroundColor: "#1c1c1c", margin: 0, display: 'flex' }
        const styleWhite = { backgroundColor: "#e5e5e5", margin: 0, display: 'flex' }
        return (
            row.map((spot, indexX) => {
                return (
                    <div key={`${indexY}-${indexX}`} style={(indexX + indexY) % 2 === 0 ? styleBlack : styleWhite}>
                        {renderPiece(board[indexY][indexX])}
                    </div>
                )
            })
        );
    }

    const renderPiece = (peca) => {
        const color = peca.cor === 1 ? 'white' : 'black';
        if(!!peca.tipo) {
            return(
                <FontAwesomeIcon style={{ position: 'relative' }} size="2x" color={color} icon={faChessBishop}/>
            );
        }
    }

    if (isLoading) { return <Loading/> } // Acesso com pedido deautenticação

    return (
        <>
            <div className='all'>
                <div className='columns'>
                    <div className='rows game-background1' style={{flex: 3}}>
                        <div name='Clock' className='rows' style={{flex: 2}}>
                            <span className='game-titles'>Timer</span>
                            <div id='Timer' className='game-border center'>
                                <span className='game-titles'>00:00:00</span>
                            </div>
                        </div>
                        <div className='rows' style={{flex: 8}}>
                            <span className='game-titles'>Status</span>
                            <div id='Timer' className='game-border center'>
                                <span className='game-titles'>Content</span>
                            </div>
                        </div>
                    </div>
                    <div className='main center game-background2' style={{flex: 8}}>
                        <div style={{ height: '85%', aspectRatio: 1, display: 'grid',  }}>
                            {renderRows()}
                        </div>
                    </div>
                    <div className='rows game-background1' style={{flex: 3}}>
                        <div className='rows' style={{flex: 4}}>
                            <span className='game-titles'>Logs</span>
                            <div id='Timer' className='game-border center'>
                                <span className='game-titles'>Content</span>
                            </div>
                        </div>
                        <div className='rows' style={{flex: 2}}>
                            <span className='game-titles'>Logs</span>
                            <div className='game-border center' style={{flex: 5}}>
                                <div className='rows'>
                                    ----------------------
                                </div>
                            </div>
                            <form className="game-call">
                                <input
                                    type="text"
                                    placeholder="Digite sua mensagem"
                                    className="game-input"
                                />
                                <button type="submit" className="game-submit">
                                    Enviar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}