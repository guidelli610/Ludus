import Header from '../../components/Header';
import './Home.css';
import Menu from '@components/Menu';

export default function HomeLateralLogo() {
    return (
        <div className='rows'>
            <div className='header' style={{position: 'absolute'}}>
                <Header />
            </div>
            <div className="home_container">
                <div className="home_image">
                    <img src="./assetsHome/hotbar_back.jpg" alt="Logo ludus" />
                    <div className='home_menu'></div>
                </div>
                <div className="home_content">
                    <h1>LUDUS</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque molestias impedit odio laudantium adipisci recusandae vitae quod nostrum veritatis, earum temporibus laborum aut autem possimus animi culpa deleniti magni libero.</p>
                </div>
            </div>
        </div>
    );
}      
