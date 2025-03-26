import { useNavigate } from 'react-router-dom';

function Game2() {
  const navigate = useNavigate(); // ✅ Make sure this is inside the component

  return (
    <div className="game">
      <h2>Welcome to Game 2!</h2>
      <button onClick={() => navigate('/')}>Return to Home</button>
    </div>
  );
}

export default Game2;
