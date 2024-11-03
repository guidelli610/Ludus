import { Link } from "react-router-dom";
import "./Icon.css"

export default function Icon(){
    return (
        <Link to="/home">
            <div className="quadrado">
                <img src="./icon/icon.png"/>
            </div>
        </Link>
    );
}