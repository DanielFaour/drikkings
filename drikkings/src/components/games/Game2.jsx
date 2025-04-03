import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./g_styles/game2.css";

function Game2() {
  const navigate = useNavigate();
  const [gameIntro, setGameIntro] = useState(true);
  const [gameEnd, setGameEnd] = useState(false);
  const [isIntroClicked, setIsIntroClicked] = useState(false);

  const [randomNumber, setRandomNumber] = useState(null);
  const [shotRounds, setShotRounds] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Cache images using useRef
  const imageCache = useRef({});

  // check if images loaded
  useEffect(() => {
    const imagePaths = {
      noBullet: new URL("./g_assets/rev_nobullet.png", import.meta.url).href,
      bullet: new URL("./g_assets/rev_bullet.png", import.meta.url).href,
      revolver: new URL("./g_assets/revolver.png", import.meta.url).href,
      revolver_dark: new URL("./g_assets/revolver_darkmode2.png", import.meta.url).href,
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
    // console.log("Generated randomNumber:", newRandomNumber);

    setTimeout(() => {
      setGameIntro(false);
      resetGun();
      spinGun();
    }, 1500);
  }

  // When gun is tapped
  function shotsFired() {
    const amountRoundsFired = shotRounds + 1;
    setShotRounds(amountRoundsFired);
    console.log("Shots Fired", amountRoundsFired);
    console.log("Hot Round", randomNumber + 1);

    if (amountRoundsFired == randomNumber + 1) {
      console.log("BANG");
      // setGameIntro(true);
      // setIsIntroClicked(false);
      setGameEnd(true);
      setShotRounds(0);
    } else {
      console.log("CLICK");
      // spins gun at the beginning of the game
      spinGun()
    }
  }

  function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const spinGun = () => {
    const gun = document.getElementById("revGun");

    gun.style.pointerEvents = "none"; // Disable click during spin
    gun.style.filter = "grayscale(100%)";

    // Generate a random rotation increment between 1 and 8 full rotations
    let rotationIncrement = randomRange(360 * 1, 360 * 6);
    
    // Generate random rotationSpeed for more dynamic spins
    const rotationSpeed = randomRange(1000, 2000);

    // Add a smooth transition for rotation
    gun.style.transition = `transform ${rotationSpeed}ms ease-out`; // Adjust time for smoother spin

    // Use the previous rotation value to calculate the new one
    setCurrentRotation((prevRotation) => {
      const newRotation = prevRotation + rotationIncrement;

      // Apply the new rotation directly
      gun.style.transform = `rotate(${newRotation}deg)`;

      return newRotation; // Return the updated value to set the state
    });

    console.log("currentRotation: ", currentRotation);

    // Re-enable the gun after the animation is complete
    setTimeout(() => {
      gun.style.pointerEvents = "auto";
      gun.style.filter = "grayscale(0%)";
    }, rotationSpeed);
  };

  // Resets the gun to its original position
  function resetGun() {
    const gun = document.getElementById("revGun");
    gun.style.transition = "none";  
    
    if (!gun) return; // Safety check

    gun.style.transform = "rotate(0deg)";
    setCurrentRotation(0);
  }

  function restartGame() {
    setGameIntro(true);
    setIsIntroClicked(false);
    setGameEnd(false);
    resetGun();
  }

  return (
    <div className="game" id="game2">
      <button id="btnReturn" onClick={() => navigate("/")}>⬅️</button>
      <h2 id="g2_title">Shot Roulette</h2>

      <div className="game2Container">
        <div id="revGun" onPointerDown={shotsFired}>

        </div>
      </div>

      {gameIntro && (
        <div id="game2Start" className={isIntroClicked ? "clicked" : ""}>
          <div
            id="revCyl"
            onPointerDown={startGame}
            className={isIntroClicked ? "clicked" : ""}
            style={{
              backgroundImage: `url(${imageCache.current[isIntroClicked ? "bullet" : "noBullet"]?.src || ""
                })`,
              opacity: imagesLoaded ? 1 : 0.8, // Fades in when ready
            }}
          ></div>
          <h3 className={isIntroClicked ? "clicked" : ""}>Plasser mobilen midt på bordet, og trykk på sylinderen for å starte spillet!</h3>
          <h3 className={isIntroClicked ? "clicked" : ""}></h3>
        </div>
      )}
      
      {gameEnd && (
        <div id="game2End">
          <h1>PAAANG!</h1>
          <button onPointerDown={restartGame}>Start på nytt</button>
        </div>
      )}
    </div>
  );
}

export default Game2;
