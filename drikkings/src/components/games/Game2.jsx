import { useNavigate } from 'react-router-dom';

function Game2() {
  const navigate = useNavigate(); // ✅ Make sure this is inside the component

  return (
    <div className="game" id="ms_game">
      <button id="btnReturn" onClick={() => navigate('/')}>⬅️</button>
      <h2>Shot Roulette</h2>
    </div>
  );
}

export default Game2;
