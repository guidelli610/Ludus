import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function Header(){
return(
        <div className="links">
            <Icon/>
            <Link to="/Login" className="">Login</Link>
            <Link to="/Register" className="">Registrar</Link>
            <Link to="/Message" className="">Mensagem</Link>
            <Link to="/About" className="">Sobre</Link>
        </div>
    )
}