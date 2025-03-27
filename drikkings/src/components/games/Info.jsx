import { useNavigate } from 'react-router-dom';

function Info() {
  const navigate = useNavigate(); // ✅ Make sure this is inside the component

  return (
    <div className="game" id="ms_game">
      <button id="btnReturn" onClick={() => navigate('/')}>⬅️</button>
      <h2>Informasjon om spill!</h2>
    </div>
  );
}

export default Info;
