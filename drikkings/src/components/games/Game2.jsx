import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./g_styles/game2.css";

function Game2() {
  const navigate = useNavigate();
  const [gameIntro, setGameIntro] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [randomNumber, setRandomNumber] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Cache images using useRef
  const imageCache = useRef({});

  // check if images loaded
  useEffect(() => {
    const imagePaths = {
      noBullet: new URL("./g_assets/rev_nobullet.png", import.meta.url).href,
      bullet: new URL("./g_assets/rev_bullet.png", import.meta.url).href,
    };

    let loadedCount = 0;
    Object.keys(imagePaths).forEach((key) => {
      if (imageCache.current[key]) {
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
    const preventScroll = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  function startGame() {
    if (!imagesLoaded) return; // Prevent click if images aren't loaded

    setRandomNumber(Math.floor(Math.random() * 6));
    setIsClicked(true);

    setTimeout(() => {
      setGameIntro(false);
    }, 1500);
  }

  return (
    <div className="game" id="game2">
      <button id="btnReturn" onClick={() => navigate("/")}>⬅️</button>
      <h2 id="g2_title">Shot Roulette</h2>

      <div className="game2Container"></div>

      {gameIntro && (
        <div className="game2Start">
          <div
            id="revCyl"
            onClick={startGame}
            className={isClicked ? "clicked" : ""}
            style={{
              backgroundImage: `url(${
                imageCache.current[isClicked ? "bullet" : "noBullet"]?.src || ""
              })`,
              opacity: imagesLoaded ? 1 : 0.8, // Fades in when ready
            }}
          ></div>
          <h3 className={isClicked ? "clicked" : ""}>Trykk på sylinderen for å starte!</h3>
        </div>
      )}
    </div>
  );
}

export default Game2;
