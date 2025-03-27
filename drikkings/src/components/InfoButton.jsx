import { useNavigate } from 'react-router-dom';

function InfoButton() {
    const navigate = useNavigate();

    return (
        <button id="btnInfo" onClick={() => navigate('/games/Info')}>ℹ️</button>
    );
}

export default InfoButton;
