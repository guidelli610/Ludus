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
                console.log(row);
                return (
                    <div className="core columns">
                        {renderColumns(row, indexY)}
                    </div>
                );
            })
        );
    }

    const renderColumns = (row, indexY) => {
        return (
            row.map((spot, indexX) => {
                console.log(spot);
                return (
                    <div className="core">
                        <p style={{margin: 0}}>Oi</p>
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
                        <div className="rows" style={{backgroundColor: 'Red', width: '80%', height: '80%', flexGrow: 0}}>
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