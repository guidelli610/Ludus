import { useState } from "react";
import { useLocation } from "react-router-dom";
import React from 'react';
import "./Game.css";
import { faChessBishop } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Game() {
    const location = useLocation();
    const { roomName, password } = location.state || {};
    const identity = localStorage.getItem('identity');
    console.log(roomName, password);

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
                    <div style={{ width: '100%', height: '100%', display: 'grid', gridAutoFlow: 'column'}}>
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
                    <div style={(indexX + indexY) % 2 === 0 ? styleBlack : styleWhite}>
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