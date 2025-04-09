import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./g_styles/game1.css";
import kaboom from './g_assets/game1/kabooom.jpg';
import kaboom_dark from './g_assets/game1/kabooom_dark.jpg';

function Game1() {
  const navigate = useNavigate();
  const [buttonStates, setButtonStates] = useState(new Array(16).fill(false));
  const [gameOver, setGameOver] = useState(false);
  const [randomNumber, setRandomNumber] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Cache images using useRef
  const imageCache = useRef({});

  // check if images loaded
  useEffect(() => {
    const imagePaths = {
      hidden: new URL("./g_assets/b_tapped.png", import.meta.url).href,
      revealed: new URL("./g_assets/b_untapped.png", import.meta.url).href,
      kaboom: new URL(kaboom, import.meta.url).href,
      kaboom_dark: new URL(kaboom_dark, import.meta.url).href,
    };

    let loadedCount = 0;

    // Preload images and check if all are loaded
    Object.keys(imagePaths).forEach((key) => {
      if (imageCache.current[key]) {
        // If already cached, just increase the count
        loadedCount++;
      } else {
        const img = new Image();
        img.src = imagePaths[key];
        img.onload = () => {
          imageCache.current[key] = img; // Store in cache
          loadedCount++;
          if (loadedCount === Object.keys(imagePaths).length) {
            setImagesLoaded(true);
          }
        };
        img.onerror = () => console.error(`Failed to load: ${img.src}`);
      }
    });

    if (loadedCount === Object.keys(imagePaths).length) {
      setImagesLoaded(true);
    }
  }, []);

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 16));
  }, []);

  function resetGame() {
    setButtonStates(new Array(16).fill(false));
    setGameOver(false);
    setRandomNumber(Math.floor(Math.random() * 16));
  }

  const buttonClickState = (i) => {
    setButtonStates((prevStates) => {
      const updatedStates = prevStates.map((state, index) =>
        index === i && !state ? true : state
      );

      if (i === randomNumber) {
        setGameOver(true);
      }

      return updatedStates;
    });
  };

  // prevent scrolling
  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  // delays the clickability on the gameover screen + animation
  const [canRestart, setCanRestart] = useState(false);

  useEffect(() => {
    if (gameOver) {
      setCanRestart(false);
      const timeout = setTimeout(() => setCanRestart(true), 500);

      const game2Pang = document.getElementById("game2Pang");
      game2Pang.style.animation = "comeIn 0.5s forwards";

      return () => clearTimeout(timeout);
    }
  }, [gameOver]);

  const handlePointerUp = () => {
    if (canRestart) {
      resetGame();
    }
  };


  return (
    <div className="game" id="game1">
      <button id="btnReturn" onClick={() => navigate("/")}>⬅️</button>
      <h2>1/16 Minesweeper</h2>

      <div className="game1Container">
        <div id="game1Buttons">
          {buttonStates.map((isClicked, i) => (
            <div className="button" key={i}>
              <button
                id={"game1Button" + i}
                className={`game1Button ${isClicked ? "clicked" : ""}`}
                onPointerUp={() => buttonClickState(i)}
                disabled={!imagesLoaded} // Prevent clicks until images are loaded
                style={{
                  opacity: imagesLoaded ? 1 : 0.8, // Fades in when ready
                  backgroundImage: imagesLoaded
                    ? isClicked
                      ? `url(${imageCache.current.hidden.src})`
                      : `url(${imageCache.current.revealed.src})`
                    : "none", // Do not set backgroundImage until images are loaded
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              ></button>
            </div>
          ))}
        </div>
      </div>

      {/* {gameOver && (
        <div className="game1End">
          <h2>KABOOOOOM!</h2>
          <button id="btnGame1End" onClick={resetGame}>Start på nytt</button>
          <button id="btnGame1Return" onClick={() => navigate("/")}>Tilbake til meny</button>
        </div>
      )} */}
      {gameOver && (
        <div id="game2End" onPointerUp={handlePointerUp}>
          <div id="spacing"></div>
          <div id="game2Pang">
            <img className="light-img" src={imageCache.current["kaboom"]?.src} alt="pang" />
            <img className="dark-img" src={imageCache.current["kaboom_dark"]?.src} alt="pang" />
            <p>Trykk på skjermen for å starte på nytt!</p>
          </div>
          <div id="spacing"></div>
          <div id="spacing"></div>
        </div>
      )}

      {/* loading */}
      {imagesLoaded || (
        <div id="gameLoad">
          <h1>Laster inn!</h1>
        </div>
      )}
    </div>
  );
}

export default Game1;
