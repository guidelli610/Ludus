import React from 'react';
import "./Match.css";

export default function Match() {
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
                        <h3>Game</h3>
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