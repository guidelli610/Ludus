import { Link } from "react-router-dom";
import Secure from "./pages/Secure/Secure";
import "./Prototype.css"

export default function Prototype(){
    return (
        <>
            <div className="p_links">
                <Link to="/prototype1" className="p_link">Registrar</Link>
                <Link to="/prototype2" className="p_link">Login</Link>
                <Link to="/prototype3" className="p_link">Acesso</Link>
            </div>
            <Secure/>
        </>
    );
}