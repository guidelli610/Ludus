import './Home.css';
export default function HomeLateralLogo() {
    return (
        <div className="home_container">
            <div className="home_image"> {/*separador para a img*/}
                <img src="./assetsHome/hotbar_back.jpg" alt="Logo ludus" />
            </div>
            <div className="home_content">{/*conteudo lateral*/}
                <h1>LUDUS</h1>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque molestias impedit odio laudantium adipisci recusandae vitae quod nostrum veritatis, earum temporibus laborum aut autem possimus animi culpa deleniti magni libero.</p>
            </div>
        </div>
    );
}
       
