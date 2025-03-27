import { useNavigate } from 'react-router-dom';

function Game1() {
  const navigate = useNavigate(); // ✅ Make sure this is inside the component

  return (
    <div className="game">
      <button id="btnReturn" onClick={() => navigate('/')}>⬅️</button>
      <h2>1/16 Minesweeper</h2>
    </div>
  );
}

export default Game1;
