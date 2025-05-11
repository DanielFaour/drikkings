import { useNavigate } from 'react-router-dom';
import infoText from '../assets/info_text.png';

function InfoButton() {
    const navigate = useNavigate();

    return (
        <div>
            <button id="btnInfo" onPointerUp={() => navigate('/games/Info')}>ℹ️</button>
            <img id="infoBtnText" src={infoText} alt="InfoBtnText" draggable="false"/>
           
        </div>
    );
}

export default InfoButton;
