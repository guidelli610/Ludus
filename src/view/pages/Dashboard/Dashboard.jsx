import React, { useState } from "react";
import Header from "../../components/Header";
import "./Dashboard.css"

function Card(title, gameID) {
    return (
        <div>
            <p>{title}</p>
        </div>
    );
}

export default function Dashboard() {
    
    const [display, setDisplay] = useState(0);  // 0: Está mostrando os jogos atuais.
                                                // 1: Está mostrando os jogos completos.

    const renderTabBar = () => {
        if(display == 0) {
            return (
                <div className="dashButtons">
                    <button value={0} onClick={(e) => {setDisplay(e.target.value)}} className={"dashButton selected"}>Jogos atuais</button>
                    <button value={1} onClick={(e) => {setDisplay(e.target.value)}} className={"dashButton"}>Jogos completos</button>
                </div>
            );
        } else if (display == 1){
            return (
                <div className="dashButtons">
                    <button value={0} onClick={(e) => {setDisplay(e.target.value)}} className={"dashButton"}>Jogos atuais</button>
                    <button value={1} onClick={(e) => {setDisplay(e.target.value)}} className={"dashButton selected"}>Jogos completos</button>
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
        }
    }

    return (
        <>
            <div className='all'>
                <div className='rows'>
                    <div className='header'>
                        <Header/>
                    </div>
                    <div className='.core'>
                        <h2 className="leftOffset">Minhas partidas</h2>
                        <div className='dashBoard fullDash'>
                            {renderTabBar()}
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}