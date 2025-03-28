import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './g_styles/game1.css';

function Game1() {
  const navigate = useNavigate();

  const [buttonStates, setButtonStates] = useState(new Array(16).fill(false));

  const buttonClickState = (i) => {
    setButtonStates((prevStates) =>
      prevStates.map((state, index) => (index === i ? !state : state))
    );
  };

  return (
    <div className="game" id="game1">
      <button id="btnReturn" onClick={() => navigate('/')}>⬅️</button>
      <h2>1/16 Minesweeper</h2>

      <div className="game1Container">
        {
          buttonStates.map((isClicked, i) => (
            <div className="button" key={i}>
              <button
                id={"game1Button" + i}
                className={`game1Button ${isClicked ? 'clicked' : ''}`}
                onClick={() => buttonClickState(i)}
              ></button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Game1;
