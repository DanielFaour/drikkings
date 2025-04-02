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
    // console.log("Generated randomNumber:", newRandomNumber);
    spinGun()

    setTimeout(() => {
      setGameIntro(false);
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
      // resetGun()
      spinGun()
    } else {
      console.log("CLICK");
      spinGun()
    }
  }

  // let lastRotation = 0; // Track the last rotation value

  // function spinGun() {
  //   const gun = document.getElementById("revGun");

  //   gun.style.pointerEvents = "none"; // making the gun unclickable during spins
  //   gun.style.filter = "blur(2px)";

  //   // Generate a random rotation, ensuring it’s sufficiently different from the last one
  //   let randomRotation = Math.round(Math.random() * (5 - 1) + 1) * 360 + Math.round(Math.random() * (24 - 1) + 1) * 15;

  //   // Update the last rotation to the current one
  //   lastRotation += randomRotation;

  //   // Smooth transition with a 0.5-second duration
  //   gun.style.transition = "transform 0.5s ease-out";
  //   gun.style.transform = `rotate(${randomRotation}deg)`;

  //   console.log(randomRotation); // Debug log for the generated rotation

  //   // when animation finished -> make gun clickable again
  //   setTimeout(() => {
  //     gun.style.pointerEvents = "auto";
  //     gun.style.filter = "blur(0px)";
  //   }, 500);
  // }


  // create a random number in range
  function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let currentRotation = 0;

  function spinGun() {
    const gun = document.getElementById("revGun");

    gun.style.pointerEvents = "none"; // making the gun unclickable during spins
    gun.style.filter = "blur(6px)";

    currentRotation = currentRotation + randomRange(2, 5) * 360 + randomRange(1, 12) * 30 + randomRange(1, 24) * 15;

    gun.style.transform = `rotate(${currentRotation}deg)`;

      // when animation finished -> make gun clickable again
      setTimeout(() => {
        gun.style.pointerEvents = "auto";
        gun.style.filter = "blur(0px)";
      }, 500);
  }




  // Resets the gun to its original position
  function resetGun() {
    const gun = document.getElementById("revGun");

    if (!gun) return; // Safety check

    gun.style.transform = "rotate(0deg)";
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
          <h3 className={isIntroClicked ? "clicked" : ""}>Plasser mobilen midt på bordet, og trykk på sylinderen for å starte spillet!</h3>
          <h3 className={isIntroClicked ? "clicked" : ""}></h3>
        </div>
      )}
    </div>
  );
}

export default Game2;
