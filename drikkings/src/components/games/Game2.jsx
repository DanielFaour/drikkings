import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./g_styles/game2.css";
import game2Pang2 from './g_assets/game2/pang_light.jpg';
import game2Pang2_dark from './g_assets/game2/pang_dark.jpg';

function Game2() {
  const navigate = useNavigate();
  const [gameIntro, setGameIntro] = useState(true);
  const [gameEnd, setGameEnd] = useState(false);
  const [isIntroClicked, setIsIntroClicked] = useState(false);
  const [firstPress, setFirstPress] = useState(false);
  const [firstNextText, setFirstNextText] = useState(false);

  const [randomNumber, setRandomNumber] = useState(null);
  const [shotRounds, setShotRounds] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Cache images using useRef
  const imageCache = useRef({});

  // check if images loaded
  useEffect(() => {
    const imagePaths = {
      noBullet: new URL("./g_assets/game2/rev_nobullet.png", import.meta.url).href,
      bullet: new URL("./g_assets/game2/rev_bullet.png", import.meta.url).href,
      revolver: new URL("./g_assets/game2/revolver.png", import.meta.url).href,
      revolver_dark: new URL("./g_assets/game2/revolver_darkmode2.png", import.meta.url).href,
      game2PangImg2: new URL(game2Pang2, import.meta.url).href,
      game2PangImg2_dark: new URL(game2Pang2_dark, import.meta.url).href,
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

    // set firstPress to true
    if (!firstPress) {
      setFirstPress(true);
    }

    if (amountRoundsFired == randomNumber + 1) {
      console.log("BANG");
      // setGameIntro(true);
      // setIsIntroClicked(false);
      setGameEnd(true);
      setFirstNextText(false);
      resetGun();
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
    const img = document.getElementsByTagName("img");
    const game2Container = document.getElementById("game2Container");

    game2Container.style.pointerEvents = "none"; // Disable click during spin
    gun.style.pointerEvents = "none"; // Disable click during spin
    img.pointerEvents = "none"; // Disable click during spin
    gun.style.filter = "grayscale(100%)";

    // Generate a random rotation increment between 1 and 8 full rotations
    let rotationIncrement = randomRange(2, 4) * 360 + randomRange(0, 360);

    // Generate random rotationSpeed for more dynamic spins
    const rotationSpeed = randomRange(1100, 1700);

    // Add a smooth transition for rotation
    gun.style.transition = `transform ${rotationSpeed}ms ease-in-out`; // Adjust time for smoother spin

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
      game2Container.style.pointerEvents = "auto";
      gun.style.filter = "grayscale(0%)";
      animateText(); // Animate the text after the spin
    }, rotationSpeed);
  };

  // "Next" text animation when gun is finished spinning
  
  function animateText() {
    const nextText = document.getElementById("nextText");

    if (!firstNextText) {
      nextText.innerHTML = "<h1>START</h1>";
      setFirstNextText(true);
    } else {
      nextText.innerHTML = "<h1>NESTE</h1>";
    }

    nextText.style.opacity = "1";
    nextText.style.animation = "comeIn 0.5s forwards";
    
    setTimeout(() => { 
      nextText.style.animation = "none"; // Reset animation
      nextText.style.transition = "opacity 0.25s ease-in-out"; // Smooth transition for opacity
      nextText.style.opacity = "0"; // Fade out the text

    }
    , 1250); // Match the duration of the animation
  }

  // Resets the gun to its original position
  function resetGun() {
    const gun = document.getElementById("revGun");
    gun.style.transition = "none";

    if (!gun) return; // Safety check

    gun.style.transform = "rotate(0deg)";
    setCurrentRotation(0);
  }

  function restartGame() {
    // setGameIntro(true);
    // setIsIntroClicked(false);

    const newRandomNumber = Math.floor(Math.random() * 6);
    setRandomNumber(newRandomNumber);

    setGameEnd(false);
    resetGun();
    spinGun();
  }

  // delays the clickability on the gameEnd screen + animation
  const [canRestart, setCanRestart] = useState(false);

  useEffect(() => {
    if (gameEnd) {
      setCanRestart(false);
      const timeout = setTimeout(() => setCanRestart(true), 500);

      const game2Pang = document.getElementById("game2Pang");
      game2Pang.style.animation = "comeIn 0.5s forwards";

      return () => clearTimeout(timeout);
    }
  }, [gameEnd]);

  const handlePointerUp = () => {
    if (canRestart) {
      restartGame();
    }
  };

  return (
    <div className="game" id="game2">
      <button id="btnReturn" onClick={() => navigate("/")}>⬅️</button>
      <h2 id="g2_title">Shot Roulette</h2>

      <div id="game2Container" onPointerUp={shotsFired}>
        <p id="introTextG2" className={firstPress ? "clicked" : ""}>Trykk for å skyte revolveren!</p>
        <div id="revGun">
          <img draggable="false" className="rev_light" src={imageCache.current["revolver"]?.src} alt="revolver" />
          <img draggable="false" className="rev_dark" src={imageCache.current["revolver_dark"]?.src} alt="revolver" />
        </div>
        <p id="shotRounds">
          <br />
          Antall avtrekk: {shotRounds} av 6
          <br />
          {Math.round((1 / (6 - shotRounds)) * 100)}% sjanse for å bli skutt!

        </p>

        <div id="nextText"/>
        
      </div>

      {gameIntro && (
        <div id="game2Start" className={isIntroClicked ? "clicked" : ""}>
          <div
            id="revCyl"
            onPointerDown={startGame}
            className={isIntroClicked ? "clicked" : ""}
          >
            <img draggable="false" className="bullet" src={imageCache.current["bullet"]?.src} alt="revolver cylinder" />
            <img draggable="false" className="nobullet" src={imageCache.current["noBullet"]?.src} alt="revolver cylinder" />
          </div>

          <h3 className={isIntroClicked ? "clicked" : ""}>Plasser mobilen midt på bordet, og så trykk på sylinderen for å starte!</h3>
          <h3 className={isIntroClicked ? "clicked" : ""}></h3>
        </div>
      )}

      {gameEnd && (
        <div id="game2End" onPointerUp={handlePointerUp}>
          <div id="spacing"></div>
          {/* <h1>PAAANG!</h1> */}
          {/* <img id="game2Pang" src={game2Pang2} alt="pang" /> */}
          <div id="game2Pang">
            <img draggable="false" className="light-img" src={imageCache.current["game2PangImg2"]?.src} alt="pang" />
            <img draggable="false" className="dark-img" src={imageCache.current["game2PangImg2_dark"]?.src} alt="pang" />
            <p>Trykk på skjermen for å starte på nytt!</p>
          </div>
          <div id="spacing"></div>
          <div id="spacing"></div>
          {/* <div id="endButtons">
            <button id="btnGame2Return" onClick={() => navigate("/")}>⬅️</button>
            <button onPointerDown={restartGame}>🔃</button>
          </div> */}
        </div>
      )}
      {imagesLoaded || (
        <div id="gameLoad">
          <h1>Laster inn!</h1>
        </div>
      )}
    </div>
  );
}

export default Game2;
