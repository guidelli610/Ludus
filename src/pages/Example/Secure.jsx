import { Link } from "react-router-dom";
import "./Prototype.css";
import secure from "@connect/secure";

export default function Prototype(){

    if (secure()) { return <Loading/> } // Acesso com pedido de autenticação

    return (
        <>
            <div className="p_links">
                <Link to="/prototype1" className="p_link">Registrar</Link>
                <Link to="/prototype2" className="p_link">Login</Link>
                <Link to="/prototype3" className="p_link">Acesso</Link>
            </div>

            <h1>Site acessado!</h1>
        </>
    );
}