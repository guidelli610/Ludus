import { Link } from "react-router-dom";
import P1 from "./p1";
import P2 from "./P2";
import P3 from "./P3";
import "./Prototype.css"

export default function Prototype(){
    return (
        <>
            <Link to="/prototype"></Link>
            <P2/>
        </>
    );
}