
import { useNavigate } from 'react-router-dom';

function GamesCards() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate('/games/game1')} className="button">🍺</button>
      <button onClick={() => navigate('/games/game2')} className="button">🍷</button>
    </>
  )
}

export default GamesCards