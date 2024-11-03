import { Link } from "react-router-dom";

export default function Menu(){
return(
        <div className="links">
            <Link to="/Home" className="">Home</Link>
            <Link to="/Login" className="">Login</Link>
            <Link to="/Register" className="">Registrar</Link>
            <Link to="/Message" className="">Mensagem</Link>
            <Link to="/Sobre" className="">Sobre</Link>
        </div>
    )
}