import { Link } from "react-router-dom";

export default function Menu(){
return(
        <div className="links">
            <Link to="/Register" className="">Registrar</Link>
            <Link to="/Login" className="">Login</Link>
            <Link to="/Acesso" className="">Acesso</Link>
        </div>
    )
}