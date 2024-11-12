import { useState } from "react";
import React from 'react';
import "./Match.css";

export default function Match() {
    const [board, updateBoard] = useState([ // Isso vai cobrir o estado em relação as peças. 
        [
            {tipo: 'Torre', cor: 'Branca'},
            {tipo: 'Cavalo', cor: 'Branca'},
            {tipo: 'Bispo', cor: 'Branca'},
            {tipo: 'Rainha', cor: 'Branca'},
            {tipo: 'Rei', cor: 'Branca'},
            {tipo: 'Bispo', cor: 'Branca'},
            {tipo: 'Cavalo', cor: 'Branca'}, 
            {tipo: 'Torre', cor: 'Branca'}
        ],
        [
            {tipo: 'Peao', cor: 'Branca'},
            {tipo: 'Peao', cor: 'Branca'},
            {tipo: 'Peao', cor: 'Branca'},
            {tipo: 'Peao', cor: 'Branca'},
            {tipo: 'Peao', cor: 'Branca'},
            {tipo: 'Peao', cor: 'Branca'},
            {tipo: 'Peao', cor: 'Branca'},
            {tipo: 'Peao', cor: 'Branca'}
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
            {tipo: 'Peao', cor: 'Preta'},
            {tipo: 'Peao', cor: 'Preta'},
            {tipo: 'Peao', cor: 'Preta'},
            {tipo: 'Peao', cor: 'Preta'},
            {tipo: 'Peao', cor: 'Preta'},
            {tipo: 'Peao', cor: 'Preta'},
            {tipo: 'Peao', cor: 'Preta'},
            {tipo: 'Peao', cor: 'Preta'}
        ],
        [
            {tipo: 'Torre', cor: 'Preta'},
            {tipo: 'Cavalo', cor: 'Preta'},
            {tipo: 'Bispo', cor: 'Preta'},
            {tipo: 'Rainha', cor: 'Preta'},
            {tipo: 'Rei', cor: 'Preta'},
            {tipo: 'Bispo', cor: 'Preta'},
            {tipo: 'Cavalo', cor: 'Preta'}, 
            {tipo: 'Torre', cor: 'Preta'}
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
        const styleBlack = { backgroundColor: "#1c1c1c", margin: 0, width: '100%', height: '100%' }
        const styleWhite = { backgroundColor: "#e5e5e5", margin: 0, width: '100%', height: '100%' }
        return (
            row.map((spot, indexX) => {
                return (
                    <div style={(indexX + indexY) % 2 === 0 ? styleBlack : styleWhite}>
                        
                        <p style={{position: 'absolute'}}>{indexX + "-" + indexY}</p>
                    </div>
                )
            })
        );
    }

    return (
        <>
            <div className='all'>
                <div className='columns'>
                    <div className='rows match-background1' style={{flex: 3}}>
                        <div name='Clock' className='rows' style={{flex: 2}}>
                            <span className='match-titles'>Timer</span>
                            <div id='Timer' className='match-border center'>
                                <span className='match-titles'>00:00:00</span>
                            </div>
                        </div>
                        <div className='rows' style={{flex: 8}}>
                            <span className='match-titles'>Status</span>
                            <div id='Timer' className='match-border center'>
                                <span className='match-titles'>Content</span>
                            </div>
                        </div>
                    </div>
                    <div className='main center match-background2' style={{flex: 8}}>
                        <div style={{ height: '85%', aspectRatio: 1, display: 'grid' }}>
                            {renderRows()}
                        </div>
                    </div>
                    <div className='rows match-background1' style={{flex: 3}}>
                        <div className='rows' style={{flex: 4}}>
                            <span className='match-titles'>Logs</span>
                            <div id='Timer' className='match-border center'>
                                <span className='match-titles'>Content</span>
                            </div>
                        </div>
                        <div className='rows' style={{flex: 2}}>
                            <span className='match-titles'>Logs</span>
                            <div className='match-border center' style={{flex: 5}}>
                                <div className='rows'>
                                    ----------------------
                                </div>
                            </div>
                            <form className="match-call">
                                <input
                                    type="text"
                                    placeholder="Digite sua mensagem"
                                    className="match-input"
                                />
                                <button type="submit" className="match-submit">
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