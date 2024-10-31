import { Link } from "react-router-dom";
import Register from "./pages/Register/Register";
import "./Prototype.css"

export default function Prototype(){
    return (
        <>
            <div className="p_links">
                <Link to="/prototype1" className="p_link">Registrar</Link>
                <Link to="/prototype2" className="p_link">Login</Link>
                <Link to="/prototype3" className="p_link">Acesso</Link>
            </div>
            <div className="p_component">
                <Register/>
            </div>
        </>
    );
}