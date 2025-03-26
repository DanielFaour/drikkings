
import { useNavigate } from 'react-router-dom';

function GamesCards() {
  const navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate('/games/game1')} className="button">1/16 Minesweeper💣</button>
      <button onClick={() => navigate('/games/game2')} className="button">Shot Roulette🥛</button>
    </>
  )
}

export default GamesCards