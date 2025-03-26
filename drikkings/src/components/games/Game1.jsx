import { useNavigate } from 'react-router-dom';

function Game1() {
  const navigate = useNavigate(); // ✅ Make sure this is inside the component

  return (
    <div className="game">
      <h2>Welcome to Game 1!</h2>
      <button onClick={() => navigate('/')}>Return to Home</button>
    </div>
  );
}

export default Game1;
