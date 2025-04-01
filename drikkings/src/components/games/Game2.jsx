import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./g_styles/game2.css";

function Game2() {
  const navigate = useNavigate();
  const [gameIntro, setGameIntro] = useState(true);
  const [isIntroClicked, setIsIntroClicked] = useState(false);

  const [randomNumber, setRandomNumber] = useState(null);
  const [shotRounds, setShotRounds] = useState(0);

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

  // prevent scrolling
  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  function startGame() {
    if (!imagesLoaded || isIntroClicked) return; // Prevent click if images aren't loaded

    setIsIntroClicked(true);
    
    const newRandomNumber = Math.floor(Math.random() * 6);
    setRandomNumber(newRandomNumber);
    console.log("Generated randomNumber:", newRandomNumber);

    setTimeout(() => {
      setGameIntro(false);
    }, 1500);
  }

  function shotsFired() {
    const amountRoundsFired = shotRounds+1;
    setShotRounds(amountRoundsFired);
    console.log("Shots Fired", amountRoundsFired);
    console.log("Hot Round", randomNumber+1);

    if (amountRoundsFired == randomNumber+1) {
      console.log("BANG");
      setGameIntro(true);
      setIsIntroClicked(false);
      setShotRounds(0);
    } else {
      console.log("CLICK");
    }
 }
  

  return (
    <div className="game" id="game2">
      <button id="btnReturn" onClick={() => navigate("/")}>⬅️</button>
      <h2 id="g2_title">Shot Roulette</h2>

      <div className="game2Container">
        <div id="revGun" onClick={shotsFired}>

        </div>
      </div>

      {gameIntro && (
        <div id="game2Start" className={isIntroClicked ? "clicked" : ""}>
          <div
            id="revCyl"
            onClick={startGame}
            className={isIntroClicked ? "clicked" : ""}
            style={{
              backgroundImage: `url(${imageCache.current[isIntroClicked ? "bullet" : "noBullet"]?.src || ""
                })`,
              opacity: imagesLoaded ? 1 : 0.8, // Fades in when ready
            }}
          ></div>
          <h3 className={isIntroClicked ? "clicked" : ""}>Trykk på sylinderen for å starte!</h3>
        </div>
      )}
    </div>
  );
}

export default Game2;
