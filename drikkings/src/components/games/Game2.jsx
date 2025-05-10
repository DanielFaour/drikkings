import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Howler } from "howler";
import "./g_styles/game2.css";
import game2Pang2 from './g_assets/game2/pang_light.jpg';
import game2Pang2_dark from './g_assets/game2/pang_dark.jpg';
import RoundsLeft from "./g_assets/game2/component/roundsLeft";
import clackSound from "./g_assets/sounds/game2/clack.mp3";
import pangSound from "./g_assets/sounds/game2/pang.mp3";
import spinSound from "./g_assets/sounds/game2/spin.mp3";

function Game2() {
  const navigate = useNavigate();
  const [gameIntro, setGameIntro] = useState(true);
  const [gameEnd, setGameEnd] = useState(false);
  const [isIntroClicked, setIsIntroClicked] = useState(false);
  const [firstPress, setFirstPress] = useState(false);
  const [firstNextText, setFirstNextText] = useState(false);
  const [clicked, setClicked] = useState(false);

  const [randomNumber, setRandomNumber] = useState(null);
  const [shotRounds, setShotRounds] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  const [imagesLoaded, setImagesLoaded] = useState(false);

  const imageCache = useRef({});
  const clickTextRef = useRef(null);
  const timeoutRef = useRef(null);

  const clickSFXRef = useRef();
  const pangSFXRef = useRef();
  const spinSFXRef = useRef();

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

  // load sound
  useEffect(() => {
    clickSFXRef.current = new Howl({
      src: [clackSound],
      rate: 1,
      volume: 0.5,
      html5: false,
      preload: true
    });
    pangSFXRef.current = new Howl({
      src: [pangSound],
      rate: 1,
      volume: 0.5,
      html5: false,
      preload: true
    });
    spinSFXRef.current = new Howl({
      src: [spinSound],
      rate: 1,
      volume: 0.5,
      html5: false,
      preload: true
    });
  }, []);

  // play intro sound
  useEffect(() => {
    if(isIntroClicked) {
      spinSFXRef.current?.play?.();
    }
  }, [isIntroClicked])
  
 // play end sound
 useEffect(() => {
  if(gameEnd) {
    pangSFXRef.current?.play?.();
  }
}, [gameEnd])

  function playClack() {
    clickSFXRef.current?.play?.();
  }



  // image loading before gamestart
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
          imageCache.current[key] = img;
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

  // prevents scrolling
  useEffect(() => {
    const preventScroll = (e) => e.preventDefault();
    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  // clear timeout hintText
  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  // start game function
  function startGame() {
    if (!imagesLoaded || isIntroClicked) return;
    const nextText = document.getElementById("nextText");
    nextText.style.display = "none";

    setIsIntroClicked(true);
    resetNextText();

    const newRandomNumber = Math.floor(Math.random() * 6);
    setRandomNumber(newRandomNumber);

    setTimeout(() => {
      nextText.style.display = "inline";
      setGameIntro(false);
      resetNextText();
      resetGun();
      spinGun();
    }, 1500);
  }

  // when activated from gamedivbox, activate shotsFired
  function shotsFired() {
    playClack();
    const amountRoundsFired = shotRounds + 1;
    setShotRounds(amountRoundsFired);
    console.log("Shots Fired", amountRoundsFired);
    console.log("Hot Round", randomNumber + 1);
    setClicked(true);

    if (clickTextRef.current) {
      clickTextRef.current.style.opacity = "0";
    }

    // when shooting, clear timeout
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (clickTextRef.current) {
        clickTextRef.current.style.opacity = "1";
      }
    }, 15000);

    if (!firstPress) {
      setFirstPress(true);
    }

    // if chamber is live, shoot, if not do otherwise
    if (amountRoundsFired == randomNumber + 1) {
      console.log("BANG");
      setGameEnd(true);
      setFirstNextText(false);
      resetGun();
      setShotRounds(0);
    } else {
      console.log("CLICK");
      spinGun();
    }
  }

  // function for creating random numbers in range
  function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // spinning animation function for the gun
  const spinGun = () => {
    const gun = document.getElementById("revGun");
    const img = document.getElementsByTagName("img");
    const game2Container = document.getElementById("game2Container");

    if (!gun || !img || !game2Container) {
      console.error(
        `${!gun ? "gun element is null. " : ""}` +
        `${!img ? "img element is null. " : ""}` +
        `${!game2Container ? "game2Container element is null. " : ""}`
      );
      return;
    }

    game2Container.style.pointerEvents = "none";
    gun.style.pointerEvents = "none";
    img.pointerEvents = "none";
    gun.style.filter = "grayscale(100%)";

    let rotationIncrement = randomRange(2, 4) * 360 + randomRange(0, 360);
    const rotationSpeed = randomRange(1200, 1800);

    gun.style.transition = `transform ${rotationSpeed}ms ease-in-out`;

    setCurrentRotation((prevRotation) => {
      const newRotation = prevRotation + rotationIncrement;
      gun.style.transform = `rotate(${newRotation}deg)`;
      return newRotation;
    });

    setTimeout(() => {
      game2Container.style.pointerEvents = "auto";
      gun.style.filter = "grayscale(0%)";
      animateText();
      setClicked(false);
    }, rotationSpeed);
  };

  // animating "next" text indicating next players turn
  function animateText() {
    const nextText = document.getElementById("nextText");
    const gun = document.getElementById("revGun");

    if (nextText == null || gun == null) {
      console.error(
        `${!gun ? "gun element is null. " : ""}` +
        `${!nextText ? "img element is null. " : ""}`
      )
      return;
    }

    if (!firstNextText) {
      nextText.innerHTML = "<h1>START</h1>";
      setFirstNextText(true);
    } else {
      nextText.innerHTML = "<h1>NESTE</h1>";
    }

    nextText.style.opacity = "1";
    nextText.style.animation = "comeIn 0.35s forwards";

    setTimeout(() => {
      nextText.style.animation = "none";
      nextText.style.transition = "opacity 0.3s ease-in-out";
      nextText.style.opacity = "0";
    }, 900);
  }

  // reset nextText to hinder text showing after game end and start
  function resetNextText() {
    const nextText = document.getElementById("nextText");
    if (nextText == null) {
      console.error("nextText element not found");
      return;
    }

    nextText.style.animation = "none";
    nextText.style.opacity = "0";
  }

  // reset gun position before/for game start
  function resetGun() {
    const gun = document.getElementById("revGun");

    if (gun == null) {
      console.error("gun element not found");
      return;
    }

    gun.style.transition = "none";
    gun.style.transform = "rotate(0deg)";
    setCurrentRotation(0);
    resetNextText();
  }

  // reset game values
  function restartGame() {
    const newRandomNumber = Math.floor(Math.random() * 6);
    setRandomNumber(newRandomNumber);
    resetNextText();
    setGameEnd(false);
    resetGun();
    spinGun();
  }

  // delay for how long after gameend screen you can restart game
  const [canRestart, setCanRestart] = useState(false);

  useEffect(() => {
    if (gameEnd) {
      setCanRestart(false);
      const timeout = setTimeout(() => setCanRestart(true), 500);

      const game2Pang = document.getElementById("game2Pang");
      game2Pang.style.animation = "comeIn 0.5s forwards";
      resetNextText();

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
      <div id="nav">
        <button id="btnReturn" onClick={() => { resetNextText(); navigate("/"); }}>⬅️</button>
        <h2 id="g2_title">Shot Roulette</h2>
      </div>

      <p id="clickTextGame2" ref={clickTextRef} className={firstPress ? "clicked" : ""}>
        Hint: Trykk for å skyte revolveren!
      </p>
      <div id="game2Container" onPointerUp={() => { shotsFired(); }}>
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

        <div id="nextText" />
        <div id="shotVisual">
          <RoundsLeft rounds={shotRounds} />
        </div>
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
          <div id="game2Pang">
            <img draggable="false" className="light-img" src={imageCache.current["game2PangImg2"]?.src} alt="pang" />
            <img draggable="false" className="dark-img" src={imageCache.current["game2PangImg2_dark"]?.src} alt="pang" />
            <p>Trykk på skjermen for å starte på nytt!</p>
          </div>
          <div id="spacing"></div>
          <div id="spacing"></div>
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
