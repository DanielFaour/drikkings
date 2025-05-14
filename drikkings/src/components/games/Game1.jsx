import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Howl, Howler } from 'howler';
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
  const [allowClick, setAllowClick] = useState(true);
  const [randomNumber, setRandomNumber] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [canRestart, setCanRestart] = useState(false);

  const imageCache = useRef({});
  const clickDownSoundRef = useRef();
  const clickUpSoundRef = useRef();
  const explosionSoundRef = useRef();

  // load sound
  useEffect(() => {
    clickDownSoundRef.current = new Howl({
      src: [clickDownSound], 
      rate: 1, 
      volume: 0.5, 
      html5: false, 
      preload: true });
    clickUpSoundRef.current = new Howl({
      src: [clickUpSound], 
      rate: 1, 
      volume: 0.5, 
      html5: false, 
      preload: true });
    explosionSoundRef.current = new Howl({
      src: [explosionSound], 
      rate: 1, 
      volume: 1.5, 
      html5: false, 
      preload: true });
  }, []);

  // if sound doesnt work try this, but this doesnt actually work most of the time, 
  // i have a component in app.jsx that fixes that if thats the case
  useEffect(() => {
    const resumeAudio = () => {
      if (Howler.ctx && Howler.state === 'suspended') {
        Howler.ctx.resume();
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') resumeAudio();
    };

    window.addEventListener('click', resumeAudio);
    window.addEventListener('touchstart', resumeAudio);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('click', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (gameOver) {
      explosionSoundRef.current?.play?.();
    }
  }, [gameOver]);

  const playClickDownSound = () => {
    clickDownSoundRef.current?.play?.();
  };

  const playClickUpSound = () => {
    setTimeout(() => clickUpSoundRef.current?.play?.(), 50);
  };

  useEffect(() => {
    const imagePaths = {
      hidden: new URL("./g_assets/game1/b_tapped.png", import.meta.url).href,
      revealed: new URL("./g_assets/game1/b_untapped.png", import.meta.url).href,
      kaboom: new URL(kaboom, import.meta.url).href,
      kaboom_dark: new URL(kaboom_dark, import.meta.url).href,
    };

    let loaded = 0;
    const total = Object.keys(imagePaths).length;

    Object.entries(imagePaths).forEach(([key, src]) => {
      if (imageCache.current[key]) {
        loaded++;
        if (loaded === total) setImagesLoaded(true);
      } else {
        const img = new Image();
        img.onload = () => {
          imageCache.current[key] = img;
          loaded++;
          if (loaded === total) setImagesLoaded(true);
        };
        img.onerror = () => console.error(`Failed to load: ${src}`);
        img.src = src;
      }
    });
  }, []);

  useEffect(() => {
    setRandomNumber(Math.floor(Math.random() * 16));
  }, []);

  const resetGame = () => {
    setButtonStates(new Array(16).fill(false));
    setGameOver(false);
    setRandomNumber(Math.floor(Math.random() * 16));
  };

  const buttonClickState = (i) => {
    setButtonStates((prev) => {
      const updated = prev.map((val, idx) => (idx === i && !val ? true : val));
      if (i === randomNumber) setGameOver(true);
      return updated;
    });
  };

  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventScroll, { passive: false });
    return () => document.removeEventListener("touchmove", preventScroll);
  }, []);

  useEffect(() => {
    if (gameOver) {
      setCanRestart(false);
      const timeout = setTimeout(() => setCanRestart(true), 500);
      setAllowClick(false);

      const game2Pang = document.getElementById("game2Pang");
      if (game2Pang) game2Pang.style.animation = "comeIn 0.5s forwards";

      return () => clearTimeout(timeout);
    }
  }, [gameOver]);

  const handlePointerUp = () => {
    if (canRestart) {
      resetGame();
      setTimeout(() => setAllowClick(true), 200);
    }
  };

  return (
    <div className="game" id="game1">
      <div id="nav">
        <button id="btnReturn" onPointerUp={() => navigate("/")}>⬅️</button>
        <h2>1/16 Minesweeper</h2>
      </div>

      <div className="game1Container">
        <div id="game1Buttons">
          {buttonStates.map((isClicked, i) => (
            <div className="button" key={i}>
              <button
                id={`game1Button${i}`}
                className={`game1Button ${isClicked ? "clicked" : ""}`}
                onPointerUp={() => {
                  if (allowClick) buttonClickState(i);
                  const btn = document.getElementById(`game1Button${i}`);
                  if (btn) btn.style.filter = "brightness(1)";
                  if (!isClicked && allowClick) playClickUpSound();
                }}
                onPointerDown={() => {
                  const btn = document.getElementById(`game1Button${i}`);
                  if (btn) btn.style.filter = "brightness(0.8)";
                  if (!isClicked && allowClick) playClickDownSound();
                }}
                onPointerLeave={() => {
                  const btn = document.getElementById(`game1Button${i}`);
                  if (btn) btn.style.filter = "brightness(1)";
                }}
                disabled={!imagesLoaded}
                style={{
                  opacity: allowClick ? 1 : 0.8,
                  backgroundImage: imagesLoaded
                    ? isClicked
                      ? `url(${imageCache.current.hidden?.src})`
                      : `url(${imageCache.current.revealed?.src})`
                    : "none",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              ></button>
            </div>
          ))}
        </div>
      </div>

      {gameOver && (
        <div id="game2End" onPointerUp={handlePointerUp}>
          <div id="spacing"></div>
          <div id="game2Pang">
            <img draggable="false" className="light-img" src={imageCache.current.kaboom?.src} alt="pang" />
            <img draggable="false" className="dark-img" src={imageCache.current.kaboom_dark?.src} alt="pang" />
            <p>Trykk på skjermen for å starte på nytt!</p>
          </div>
          <div id="spacing"></div>
          <div id="spacing"></div>
        </div>
      )}

      {!imagesLoaded && (
        <div id="gameLoad">
          <h1>Laster inn!</h1>
        </div>
      )}
    </div>
  );
}

export default Game1;