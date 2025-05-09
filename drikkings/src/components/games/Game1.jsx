import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Howl } from 'howler';
import "./g_styles/game1.css";
import kaboom from './g_assets/game1/kabooom.jpg';
import kaboom_dark from './g_assets/game1/kabooom_dark.jpg';
import clickDownSound from "./g_assets/sounds/game1/clickdown.mp3";
import clickUpSound from "./g_assets/sounds/game1/clickup.mp3";
import explosionSound from "./g_assets/sounds/game1/explosion.mp3";

function Game1() {
  const navigate = useNavigate();
  const [buttonStates, setButtonStates] = useState(new Array(16).fill(false));
  const [gameOver, setGameOver] = useState(false);
  const [randomNumber, setRandomNumber] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Cache images using useRef
  const imageCache = useRef({});

  // play sound on button click
  const clickDownSoundRef = useRef(null);
  function playClickDownSound() {
    if (!clickDownSoundRef.current) {
      clickDownSoundRef.current = new Howl({
        src: [clickDownSound],
        rate: 1,
        volume: 0.15,
      });
    }

    const sound = clickDownSoundRef.current;
    if (sound && typeof sound.play === 'function') {
      sound.play();
    }
  }

  const clickUpSoundRef = useRef(null);
  function playClickUpSound() {
    if (!clickUpSoundRef.current) {
      clickUpSoundRef.current = new Howl({
        src: [clickUpSound],
        rate: 1,
        volume: 0.15,
      });
    }

    const sound = clickUpSoundRef.current;
    if (sound && typeof sound.play === 'function') {
      setTimeout(() => {
        sound.play();
      }, 100);
    }
  }

  // play sound when explosion
  const explotionSoundRef = useRef(null);
  useEffect(() => {
    if (!explotionSoundRef.current) {
      explotionSoundRef.current = new Howl({
        src: [explosionSound],
        volume: 0.15,
        rate: 1,
      });
    }

    if (gameOver) {
      const sound = explotionSoundRef.current;
      if (sound && typeof sound.play === 'function') {
        sound.play();
      }
    }

  }, [gameOver]);

  // creates a random number between min and max
  function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

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
      <div id="nav">
        <button id="btnReturn" onClick={() => navigate("/")}>⬅️</button>
        <h2>1/16 Minesweeper</h2>
      </div>

      <div className="game1Container">
        <div id="game1Buttons">
          {buttonStates.map((isClicked, i) => (
            <div className="button" key={i}>
              <button
                id={"game1Button" + i}
                className={`game1Button ${isClicked ? "clicked" : ""}`}
                // Change button state and brightness on click
                onPointerUp={() => {
                  buttonClickState(i); // Update button state on click
                  const button = document.getElementById("game1Button" + i);
                  button.style.filter = "brightness(1)";
                  if (!isClicked) { playClickUpSound(); }
                }}
                onPointerDown={() => {
                  const button = document.getElementById("game1Button" + i);
                  button.style.filter = "brightness(0.8)";
                  if (!isClicked) { playClickDownSound(); }
                }}
                onPointerLeave={() => {
                  const button = document.getElementById("game1Button" + i);
                  button.style.filter = "brightness(1)";
                }}
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
            <img draggable="false" className="light-img" src={imageCache.current["kaboom"]?.src} alt="pang" />
            <img draggable="false" className="dark-img" src={imageCache.current["kaboom_dark"]?.src} alt="pang" />
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
