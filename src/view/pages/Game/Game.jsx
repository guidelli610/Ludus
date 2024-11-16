import { useEffect, useState, useRef, useContext } from "react";
import { SocketContext } from '@controller/SocketProvider';
import { useLocation, useNavigate } from "react-router-dom";
import React from 'react';
import "./Game.css";
import Loading from "@pages/Loading/Loading";
import { faChessBishop } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import IconChess from "@components/IconChess";

export default function Game() {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, password } = location.state || {};

    const [fail, setFail] = useState(false); // Estado para controlar a visibilidade do alerta

    const [senderList, setSenderList] = useState([]); // Armazenamento dos remetentes
    const [messageList, setMessageList] = useState([]); // Armazenamento das mensagens
    const [isLoading, setIsLoading] = useState(true);

    const [validMoves, setValidMoves] = useState([]);

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

    const initialBoard = [
        [ { piece: 'br', x: 0, y: 0 }, { piece: 'bn', x: 1, y: 0 }, { piece: 'bb', x: 2, y: 0 }, { piece: 'bq', x: 3, y: 0 }, { piece: 'bk', x: 4, y: 0 }, { piece: 'bb', x: 5, y: 0 }, { piece: 'bn', x: 6, y: 0 }, { piece: 'br', x: 7, y: 0 } ],
        [ { piece: 'bp', x: 0, y: 1 }, { piece: 'bp', x: 1, y: 1 }, { piece: 'bp', x: 2, y: 1 }, { piece: 'bp', x: 3, y: 1 }, { piece: 'bp', x: 4, y: 1 }, { piece: 'bp', x: 5, y: 1 }, { piece: 'bp', x: 6, y: 1 }, { piece: 'bp', x: 7, y: 1 } ],
        [ { piece: '', x: 0, y: 2 }, { piece: '', x: 1, y: 2 }, { piece: '', x: 2, y: 2 }, { piece: '', x: 3, y: 2 }, { piece: '', x: 4, y: 2 }, { piece: '', x: 5, y: 2 }, { piece: '', x: 6, y: 2 }, { piece: '', x: 7, y: 2 } ],
        [ { piece: '', x: 0, y: 3 }, { piece: '', x: 1, y: 3 }, { piece: '', x: 2, y: 3 }, { piece: '', x: 3, y: 3 }, { piece: '', x: 4, y: 3 }, { piece: '', x: 5, y: 3 }, { piece: '', x: 6, y: 3 }, { piece: '', x: 7, y: 3 } ],
        [ { piece: '', x: 0, y: 4 }, { piece: '', x: 1, y: 4 }, { piece: '', x: 2, y: 4 }, { piece: '', x: 3, y: 4 }, { piece: '', x: 4, y: 4 }, { piece: '', x: 5, y: 4 }, { piece: '', x: 6, y: 4 }, { piece: '', x: 7, y: 4 } ],
        [ { piece: '', x: 0, y: 5 }, { piece: '', x: 1, y: 5 }, { piece: '', x: 2, y: 5 }, { piece: '', x: 3, y: 5 }, { piece: '', x: 4, y: 5 }, { piece: '', x: 5, y: 5 }, { piece: '', x: 6, y: 5 }, { piece: '', x: 7, y: 5 } ],
        [ { piece: 'wp', x: 0, y: 6 }, { piece: 'wp', x: 1, y: 6 }, { piece: 'wp', x: 2, y: 6 }, { piece: 'wp', x: 3, y: 6 }, { piece: 'wp', x: 4, y: 6 }, { piece: 'wp', x: 5, y: 6 }, { piece: 'wp', x: 6, y: 6 }, { piece: 'wp', x: 7, y: 6 } ],
        [ { piece: 'wr', x: 0, y: 7 }, { piece: 'wn', x: 1, y: 7 }, { piece: 'wb', x: 2, y: 7 }, { piece: 'wq', x: 3, y: 7 }, { piece: 'wk', x: 4, y: 7 }, { piece: 'wb', x: 5, y: 7 }, { piece: 'wn', x: 6, y: 7 }, { piece: 'wr', x: 7, y: 7 } ],
      ];

    const [board, setBoard] = useState(initialBoard);

    const renderRows = () => {
        const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
        return (
            board.map((row, indexY) => {
                return (
                    <div key={indexY} style={{ width: '100%', height: '100%', display: 'grid', gridAutoFlow: 'column', alignItems: "center"}}>
                        <span className="cordY">{8-indexY}</span>
                        {renderColumns(row, indexY)}
                    </div>
                );
            })
        );
    }

    const renderColumns = (row, indexY) => {
        return (
            row.map((piece, indexX) => (
                <div
                    key={`${indexY}-${indexX}`}
                    className={`
                        ${validMoves.some(move => move.x === indexX && move.y === indexY) ? 'valid-move' : ''}
                        ${(indexX + indexY) % 2 === 0 ? 'black-square' : 'white-square'} `}
                >
                    {renderPiece(piece, indexY, indexX)}
                </div>
            ))
        );
    }
    
    const [draggedPiece, setDraggedPiece] = useState(null);
    const [dragging, setDragging] = useState(false);

    const validMovePush = (validMoves, x, y) => {
        if (x >= 0 && x < 8 && y >= 0 && y < 8) {
            validMoves.push({ x: x, y: y})
        }
    }

    const calculateValidMoves = (piece, x, y, board) => {
        const validMoves = [];
        console.log("Calculate: ",piece, x, y, board[y][x].piece)
        
        switch (piece[1]) {
            case 'p': // Peão (simplificado - apenas um passo para frente)
                if (piece[0] === 'w' && y > 0 && board[y-1][x].piece === '') validMoves.push({ x: x, y: y - 1 }); // Branco
                if (piece[0] === 'w' && y == 6 && board[y-1][x].piece === '' && board[y-2][x].piece === '') validMoves.push({ x: x, y: y - 2 }); // Branco
                if (piece[0] === 'w' && y > 0 && board[y-1][x].piece === '') validMoves.push({ x: x, y: y - 1 }); // Branco

                if (piece[0] === 'b' && y < 7 && board[y+1][x].piece === '') validMoves.push({ x: x, y: y + 1 }); // Preto
                if (piece[0] === 'b' && y == 1 && board[y+1][x].piece === '' && board[y+2][x].piece === '') validMoves.push({ x: x, y: y + 2 }); // Preto
                break;
            case 'r': // Torre (simplificado - apenas um espaço em linha reta)
                // Adicione lógica para movimentos horizontais e verticais da Torre
                break;
            case 'n': // Cavalo (simplificado - apenas um movimento em L)
                // Adicione lógica para movimentos em L do Cavalo
                break;
            case 'b': // Bispo (simplificado - apenas um espaço em diagonal)
                // Adicione lógica para movimentos diagonais do Bispo
                break;
            case 'q': // Rainha (simplificado - movimentos em linha reta e diagonais)
                // Adicione lógica para movimentos da Rainha
                break;
            case 'k': // Rei (simplificado - apenas um espaço em qualquer direção)
                // Adicione lógica para movimentos do Rei
                break;
        }

        console.log("Valid: ", validMoves);
        return validMoves;
    };

    const handleDragStart = (e, piece, x, y) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ piece, x, y })); // Armazena a peça E sua posição
        setDraggedPiece({ piece, x, y });
        setDragging(true);
        const moves = calculateValidMoves(piece, x, y, board);
        console.log("mo",moves)
        setValidMoves(moves);
        console.log("handleDragStart");
    };

    const handleDragEnd = (e) => {
        setDragging(false);
        setDraggedPiece(null);
        console.log("handleDragEnd");
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        console.log("handleDragOver");
    };

    const handleDrop = (e, toY, toX) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        console.log("Data recebida:", data, board[toY][toX].piece[0]); // Verifique o conteúdo de data
        const { piece, x, y } = data;

        const isValid = validMoves.some(move => move.x === toX && move.y === toY);
        
        // Verifica se a casa de destino está vazia OU se a peça é do adversário
        if ((board[toY][toX] === '' || board[toY][toX].piece[0] !== piece[0]) && isValid) {
            const newBoard = board.map((row, indexY) =>
                row.map((cell, indexX) => {
                    if (indexY === y && indexX === x) {
                        return { piece: '', x: indexX, y: indexY }; // Casa de origem fica vazia
                    } else if (indexY === toY && indexX === toX) {
                        return { piece: piece, x: indexX, y: indexY }; // Peça movida para a nova posição
                    } else {
                        return cell;
                    }
                })
            );
            setBoard(newBoard);
        } else {
            console.error('Casa ocupada por uma peça sua!');
        }

        setValidMoves([]);
    };

    const renderPiece = (peca, indexY, indexX) => (
        <IconChess
            key={`${indexY}-${indexX}`}
            piece={peca.piece}
            onDragStart={(e) => handleDragStart(e, peca.piece, peca.x, peca.y)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, indexY, indexX)}
        />
    );
    
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