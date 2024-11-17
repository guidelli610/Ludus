import { useEffect, useState, useRef, useContext } from "react";
import { SocketContext } from '@controller/SocketProvider';
import { redirect, useLocation, useNavigate } from "react-router-dom";
import secure from "@connect/secure";
import React from 'react';
import "./Game.css";
import Loading from "@pages/Loading/Loading";
import IconChess from "@components/IconChess";

export default function Game() {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, password } = location.state || {};

    const [white, setWhite] = useState('');
    const [black, setBlack] = useState('');
    const [turn, setTurn] = useState('');
    const [players, setPlayers] = useState('');

    const identity = localStorage.getItem('identity');

    const [senderList, setSenderList] = useState([]); // Armazenamento dos remetentes
    const [messageList, setMessageList] = useState([]); // Armazenamento das mensagens

    const [isWaiting, setIsWaiting] = useState(true);

    const [validMoves, setValidMoves] = useState([]);

    const { socket, connected, error } = useContext(SocketContext);

    const [time, setTime] = useState(0); // Tempo em segundos

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000); // Atualiza a cada 1000 milissegundos (1 segundo)
    
        return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
    }, []);

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {

        if (!socket) return; // Proteção contra socket nulo

        if (name === undefined){
            navigate('/matchs', { state: { error: true, message: "Falha de criação de sala!"} });
        }

        // Recebimento de mensagens
        socket.on("message", (sender, message) => {
            console.log(`Mensagem do servidor de ${sender}:`, message);
            setMessageList( prevList => [...prevList, message]);
            setSenderList( prevList => [...prevList, sender]);
        });

        // Recebimento de mensagens
        socket.on("updateGame", (white, black, turn) => {
            console.log("updateGame (w/b/t)", white, black, turn);
            setIsWaiting(false);
            setWhite(white);
            setBlack(black);
            setTurn(turn);
        });
        
        // Recebimento de mensagens
        socket.on("updateBoard", (board) => {
            setBoard(board);
        });

        // Recebimento de mensagens
        socket.on("sucess", (sucess, message='') => {
            console.log("Sucess: ", sucess, message);
            //setAlertMessage(message);
            //setShowAlert(!sucess);
            //setJump(sucess);
        });

        // Recebimento de mensagens
        socket.on("message", (sender, message='') => {
            console.log("Menssagem: ", sender, message);
        });

        // Recebimento de mensagens
        socket.on("uptadeRoom", () => {
            socket.emit('requestUpdateGame');
            if (isWaiting) {
                socket.emit('startMatch');
            }
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

    // _______________________________________________[Lógica e Manipulação das peças]_______________________________________________ //

    const validEmptyOnePoint = (validMoves, x, y, piece, board, xPlus, yPlus) => {
        if (x+xPlus >= 0 && x+xPlus < 8 && y+yPlus >= 0 && y+yPlus < 8 ) {
            if (board[y+yPlus][x+xPlus]?.piece == '' && piece[0] != board[y+yPlus][x+xPlus].piece[0]){
                validMoves.push({ x: (x + xPlus), y: (y + yPlus)})
                return false;
            }
        }
        return true
    }

    const validNotEmptyOnePoint = (validMoves, x, y, piece, board, xPlus, yPlus) => {
        if (x+xPlus >= 0 && x+xPlus < 8 && y+yPlus >= 0 && y+yPlus < 8 ) {
            if (board[y+yPlus][x+xPlus]?.piece != '' && piece[0] != board[y+yPlus][x+xPlus].piece[0]){
                validMoves.push({ x: (x + xPlus), y: (y + yPlus)})
                return false;
            }
        }
        return true
    }

    const validAnythingOnePoint = (validMoves, x, y, piece, board, xPlus, yPlus) => {
        if (x+xPlus >= 0 && x+xPlus < 8 && y+yPlus >= 0 && y+yPlus < 8 ) {
            if (piece[0] != board[y+yPlus][x+xPlus].piece[0]){
                validMoves.push({ x: (x + xPlus), y: (y + yPlus)})
                return false;
            }
        }
        return true
    }

    // Lógica
    const calculateValidMoves = (piece, x, y, board) => {
        const validMoves = [];
        const typePiece = piece[0];
        if (identity == turn && (identity == white ? 'w' : 'b') == typePiece){
            switch (piece[1]) {
                case 'p': // Peão
                    if (typePiece === 'w'){
                        //Move
                        validEmptyOnePoint(validMoves, x, y, piece, board, 0, -1);
                        if (y == 6) for (let i = 1; i < 3; i++) { 
                            if (validEmptyOnePoint(validMoves, x, y, piece, board, 0, -i)) { break; };
                        }
                        //Attack
                        validNotEmptyOnePoint(validMoves, x, y, piece, board, -1, -1);
                        validNotEmptyOnePoint(validMoves, x, y, piece, board, 1, -1);
                    } else if (typePiece === 'b'){
                        //Move
                        validEmptyOnePoint(validMoves, x, y, piece, board, 0, 1);
                        if (y == 1) for (let i = 1; i < 3; i++) { 
                            if (validEmptyOnePoint(validMoves, x, y, piece, board, 0, i)) { break; };
                        }
                        //Attack
                        validNotEmptyOnePoint(validMoves, x, y, piece, board, 1, 1);
                        validNotEmptyOnePoint(validMoves, x, y, piece, board, -1, 1);
                    }
                    break;
                case 'r': // Torre
                    for (let i = 1; i < 8; i++) { // Cima
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, 0, -i)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, 0, -i); break; };
                    }
                    for (let i = 1; i < 8; i++) { // Baixo
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, 0, i)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, 0, i); break; };
                    }
                    for (let i = 1; i < 8; i++) { // Esquerda
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, -i, 0)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, -i, 0); break; };
                    }
                    for (let i = 1; i < 8; i++) { // Direta
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, i, 0)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, i, 0); break; };
                    }
                    break;
                case 'n': // Cavalo
                    validAnythingOnePoint(validMoves, x, y, piece, board, 1, -2);
                    validAnythingOnePoint(validMoves, x, y, piece, board, -1, -2);
    
                    validAnythingOnePoint(validMoves, x, y, piece, board, -1, 2);
                    validAnythingOnePoint(validMoves, x, y, piece, board, 1, 2);
                    
                    validAnythingOnePoint(validMoves, x, y, piece, board, 2, -1);
                    validAnythingOnePoint(validMoves, x, y, piece, board, -2, -1);
    
                    validAnythingOnePoint(validMoves, x, y, piece, board, -2, 1);
                    validAnythingOnePoint(validMoves, x, y, piece, board, 2, 1);
                    break;
                case 'b':
                    for (let i = 1; i < 8; i++) { // Direita superior
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, i, -i)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, i, -i); break; };
                    }
                    for (let i = 1; i < 8; i++) { // Esquerda superior
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, -i, -i)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, -i, -i); break; };
                    }
                    for (let i = 1; i < 8; i++) { // Esquerda inferior
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, -i, i)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, -i, i); break; };
                    }
                    for (let i = 1; i < 8; i++) { // Direita inferior
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, i, i)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, i, i); break; };
                    }
                    break;
                case 'q': // Rainha
                    // Torre
                    for (let i = 1; i < 8; i++) { // Cima
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, 0, -i)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, 0, -i); break; };
                    }
                    for (let i = 1; i < 8; i++) { // Baixo
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, 0, i)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, 0, i); break; };
                    }
                    for (let i = 1; i < 8; i++) { // Esquerda
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, -i, 0)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, -i, 0); break; };
                    }
                    for (let i = 1; i < 8; i++) { // Direta
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, i, 0)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, i, 0); break; };
                    }
                    // Bispo
                    for (let i = 1; i < 8; i++) { // Direita superior
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, i, -i)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, i, -i); break; };
                    }
                    for (let i = 1; i < 8; i++) { // Esquerda superior
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, -i, -i)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, -i, -i); break; };
                    }
                    for (let i = 1; i < 8; i++) { // Esquerda inferior
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, -i, i)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, -i, i); break; };
                    }
                    for (let i = 1; i < 8; i++) { // Direita inferior
                        if (validEmptyOnePoint(validMoves, x, y, piece, board, i, i)) { validNotEmptyOnePoint(validMoves, x, y, piece, board, i, i); break; };
                    }
                    break;
                case 'k': // Rei
                    validAnythingOnePoint(validMoves, x, y, piece, board, 1, -1);
                    validAnythingOnePoint(validMoves, x, y, piece, board, 0, -1);
                    validAnythingOnePoint(validMoves, x, y, piece, board, -1, -1);
    
                    validAnythingOnePoint(validMoves, x, y, piece, board, -1, 0);
    
                    validAnythingOnePoint(validMoves, x, y, piece, board, -1, 1);
                    validAnythingOnePoint(validMoves, x, y, piece, board, 0, 1);
                    validAnythingOnePoint(validMoves, x, y, piece, board, 1, 1);
    
                    validAnythingOnePoint(validMoves, x, y, piece, board, 1, 0);
                    break;
            }
        }
        return validMoves;
    };

    // ______________________________________________________________________________________________ //

    // _______________________________________________[DragAndDrop]_______________________________________________ //

    const [draggedPiece, setDraggedPiece] = useState(null);
    const [dragging, setDragging] = useState(false);

    const handleDragStart = (e, piece, x, y) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ piece, x, y })); // Armazena a peça E sua posição
        setDraggedPiece({ piece, x, y });
        setDragging(true);
        const moves = calculateValidMoves(piece, x, y, board);
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

    const move = (piece, positionA, positionB) => {

        if (positionB?.leght != positionA?.leght != 2) {
            console.log("Valores inválidos!");
            return;
        }

        const x = letterToLowercaseNumber(positionA[0]);
        const y = parseInt(positionA[1]);
        const toX = letterToLowercaseNumber(positionB[0]);
        const toY = parseInt(positionB[1]);

        console.log(`Movimento processado como: [${x} ${y}] [${toX} ${toY}]`);

        function letterToLowercaseNumber(letter) {
            const charCode = letter.charCodeAt(0);
            if (charCode >= 97 && charCode <= 122) { // Verifica se é uma letra minúscula
              return charCode - 97;
            } else {
              return null; // Ou lance uma exceção: throw new Error("Caractere inválido.");
            }
          }
        
        // Verifica se a casa de destino está vazia OU se a peça é do adversário
        if ((board[toY][toX] === '' || board[toY][toX].piece[0] !== piece[0])) {
            const newBoard = board.map((row, indexY) =>
                row.map((cell, indexX) => {
                    if (indexY === y && indexX === x) {
                        return { piece: '', x: indexX, y: indexY }; // Casa de origem fica vazia
                    } else if (indexY === toY && indexX === toX) {
                        return { piece: piece, x: indexX, y: indexY }; // Peça movida para a nova posição
                    } else {
                        return cell;
                    }
                }));
        setBoard(newBoard);
        }
    };

    const handleDrop = (e, toY, toX) => {
        e.preventDefault();
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        //console.log("Data recebida:", data, board[toY][toX].piece[0]); // Verifique o conteúdo de data
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
            //setTurn(identity == white ? black : white);
            setBoard(newBoard);

            function numberToLetterLowercase(num) {
                if (num < 0 || num > 25) {
                  return null; // Ou lance uma exceção
                }
                return String.fromCharCode(97 + num); // 97 é o código ASCII de 'a'
            }

            const from = `${numberToLetterLowercase(x)}${8-y}`;
            const to = `${numberToLetterLowercase(toX)}${8-toY}`;
            console.log("Movimento: ", from + ' -> ' + to);
            socket.emit('move', from, to, newBoard);
        } else {
            console.error('Casa ocupada por uma peça sua!');
        }

        setValidMoves([]);
    };

    // ______________________________________________________________________________________________ //

    
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

    // Renderização de peça
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

    const waiting = () => {
        return isWaiting ? (
            <div className="center createStyle">
                <span className='title'>Esperando jogador...</span>
            </div>
        ) : null;
    };
    
    //if (secure()) { return <Loading/>; }

    return (
        <>
            <div className='all'>
                <div className='columns'>
                    <div className='rows game-background1' style={{flex: 3}}>
                        <div name='Clock' className='rows' style={{flex: 2}}>
                            <span className='game-titles'>Timer</span>
                            <div id='Timer' className='game-border center'>
                                <span className='game-titles'>{formatTime(time)}</span>
                            </div>
                        </div>
                        <div className='rows' style={{flex: 8}}>
                            <span className='game-titles'>Status</span>
                            <div id='Content' className='game-border' style={{flex: '1', padding: '10px'}}>
                                <div className="center">
                                    <p className='game-subtitles' >Sala</p>
                                </div>
                                <div className="bar"/>
                                <p className='game-p'>Nome da sala: [ {name} ]</p>
                                <p className='game-p'>Senha: [ {password == '' ? "Nenhuma" : password} ]</p>
                                <div className="center">
                                    <p className='game-subtitles'>Partida</p>
                                </div>
                                <div className="bar"/>
                                <p className='game-p'>Brancas: [ {white} ]</p>
                                <p className='game-p'>Pretas: [ {black} ]</p>
                                <p className='game-p'>Turno: [ {turn} ] </p>
                                <div className="center">
                                    <p className='game-subtitles'>Jogadores</p>
                                </div>
                                <div className="bar"/>
                                <p className='game-p'>Você: [ {identity} ]</p>
                                <p className='game-p'>Partida: [ {players} ]</p>
                                <p className='game-p'>Espectadores: [ {} ]</p>
                            </div>
                        </div>
                    </div>
                    <div className='main center game-background2' style={{flex: 8}}>
                        <div style={{ height: '85%', aspectRatio: 1, display: 'grid' }}>
                            {renderRows()}
                        </div>
                    </div>
                    <div className='rows game-background1' style={{flex: 3}}>
                        <div className='rows' style={{flex: 4}}>
                            <span className='game-titles'>Historical</span>
                            <div id='Content' className='game-border center'>
                                <span className='game-titles'>Content</span>
                            </div>
                        </div>
                        <div className='rows' style={{flex: 2}}>
                            <span className='game-titles'>Messages</span>
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
                {waiting()}
            </div>
        </>
    )
}