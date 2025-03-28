import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './g_styles/game1.css';

function Game1() {
  const navigate = useNavigate();

  const [randomNumber, setRandomNumber] = useState(null);
  console.log(randomNumber);

  // Generate random number once when the component mounts
  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 16));
  }, []);

  const [buttonStates, setButtonStates] = useState(new Array(16).fill(false));
  const [gameOver, setGameOver] = useState(false); // State to manage game over message

  function resetGame() {
    setButtonStates(new Array(16).fill(false)); // Reset button states
    setGameOver(false); // Reset game over state
    setRandomNumber(Math.floor(Math.random() * 16)); // Generate a new random number
  }

  const buttonClickState = (i) => {
    setButtonStates((prevStates) => {
      const updatedStates = prevStates.map((state, index) =>
        index === i && !state ? true : state // Prevent unclicking
      );

      // Check if the clicked button matches the random number
      if (i === randomNumber) {
        setGameOver(true); // Set game over state to true
      }

      return updatedStates; // Return the updated states
    });
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
                onPointerDown={() => buttonClickState(i)}
              ></button>
            </div>
          ))
        }
      </div>

      {/* Conditionally render the game over message */}
      {gameOver && (
        <div className="game1End">
          <h2>KABOOOOOM!</h2>
          <button id="btnGame1End" onClick={resetGame}>Spill igjen</button>
          <button id="btnGame1Return" onClick={() => navigate('/')}>Tilbake til meny</button>
        </div>
      )}
    </div>
  );
}

export default Game1;
