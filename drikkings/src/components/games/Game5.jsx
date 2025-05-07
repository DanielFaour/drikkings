import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./g_styles/game5.css";
import { v4 as uuidv4 } from 'uuid';
import ShakePermission from "./g_assets/game5/ShakePermission";

function Game5() {
    const navigate = useNavigate();
    const imageCache = useRef({});
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const timeoutRef = useRef(null);
    const clickTextRef = useRef(null);

    const [randNum, setRandNum] = useState(null);
    const [randLoss, setRandLoss] = useState(null);


    const [shakeCounter, setShakeCounter] = useState(0);
    const [shake, setShake] = useState(0);
    const [gameFinish, setGameFinish] = useState(false)
    const [randomShakeOffset, setRandomShakeOffset] = useState(0);

    // check if images loaded
    useEffect(() => {
        const imagePaths = {
            bottle: new URL("./g_assets/game5/bottle.svg", import.meta.url).href,
            popLight: new URL("./g_assets/game5/pop_lightv2.jpg", import.meta.url).href,
            popDark: new URL("./g_assets/game5/pop_darkv2.jpg", import.meta.url).href,
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

    // creates a random number between min and max
    function randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    function handleMotionEvent(event) {
        const game5bg = document.getElementById("game5bg");
        game5bg.style.transition = "0.2s";

        const y = event.acceleration.y;

        // register shakes
        if (y > 20) {
            setShake(1);
        }
        else if (y < -20) {
            setShake(-1);
        } else {
            setShake(0);
        }
    }

    // event listener for motion movement
    window.addEventListener("devicemotion", handleMotionEvent, true);

    useEffect(() => {
        const shakeText = document.getElementById("shakeData");
        const bottle = document.getElementById("bottleShake");

        if (gameFinish) {
            // shakeText.innerHTML = 0;
            return;
        }

        if (randNum == null) {
            setRandNum(randomRange(25, 300));
            setRandLoss(randomRange(25, 400));
            setRandomShakeOffset(randomRange(-25, 25));
        }

        if (shake == 1) {
            setShakeCounter((prevCounter) => prevCounter + 1);
        } else if (shake == -1) {
            setShakeCounter((prevCounter) => prevCounter + 1);
        }

        // shakeText.innerHTML = randLoss;

        const prosentShake = Math.floor((shakeCounter / randNum) * 100);

        if (bottle) {
            if (prosentShake >= 85 + randomShakeOffset) {
                setBottleShake(0.1)
            } else if (prosentShake >= 60 + randomShakeOffset) {
                setBottleShake(0.3)
            } else if (prosentShake >= 40 + randomShakeOffset) {
                setBottleShake(0.5)
            } else if (prosentShake >= 20 + randomShakeOffset) {
                setBottleShake(1)
            } else if (shake > 0) {
                setBottleShake(2)
            }
        }

        if (shakeCounter > randLoss && !gameFinish || shakeCounter > randNum && !gameFinish) {
            bottle.style.animation = "none";
            setGameFinish(true);
            setShakeCounter(0);
        }

        clickTextRef.current.style.opacity = "0";
    }, [shake]);

    // function for shaking the bottle
    function setBottleShake(x) {
        const bottle = document.getElementById("bottleShake");
        bottle.style.animation = `shake ${x}s infinite`;

        // clearTimeout(bottle.shakeTimeout);
        // bottle.shakeTimeout = setTimeout(() => {
        //     clearInterval(bottle.shakeInterval);
        //     bottle.style.animation = `shake ${1}s infinite`
        // }, 3000);
    }


    function resetGame() {
        const shakeText = document.getElementById("shakeData");
        // shakeText.innerHTML = 0;
        setRandNum(randomRange(25, 300));
        setRandLoss(randomRange(25, 400));
        setRandomShakeOffset(randomRange(-15, 15));
        setShakeCounter(0);
        setGameFinish(false);
        clickTextRef.current.style.opacity = "1";
    }

    // clear timeout hintText
    useEffect(() => {
        clickTextRef.current.style.opacity = "1";
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
        if (clickTextRef.current) {
            clickTextRef.current.style.opacity = "1";
        }
    }, 14000);


    // delay for how long after gameend screen you can restart game
    const [canRestart, setCanRestart] = useState(false);

    useEffect(() => {
        if (gameFinish) {
            setCanRestart(false);
            const timeout = setTimeout(() => setCanRestart(true), 500);

            const game5Pop = document.getElementById("game5Pop");
            game5Pop.style.animation = "comeIn 0.5s forwards";

            return () => clearTimeout(timeout);
        }
    }, [gameFinish]);

    const handlePointerUp = () => {
        if (canRestart) {
            resetGame();
        }
    };

    return (
        <div className="game" id="game5">
            <div id="nav">
                <button id="btnReturn" onClick={() => navigate("/")}>⬅️</button>
                <h2 id="g3_title">Shake it</h2>
            </div>
            <div id="game5Container">
                <p id="clickTextGame5" ref={clickTextRef}>
                    Hint: Rist mobilen for å riste flasken!
                </p>
                <div id="game5bg">
                    <ShakePermission />
                    <p id="shakeData"></p>
                    <img  draggable="false" id="bottleShake" src={imageCache.current["bottle"]?.src} alt="bottle" />
                </div>
            </div>


            {!imagesLoaded && (
                <div id="gameLoad">
                    <h1>Laster inn!</h1>
                </div>
            )}

            {gameFinish && (
                <div id="game5End" onPointerUp={handlePointerUp}>
                    <div id="spacing"></div>
                    <div id="game5Pop">
                        <img draggable="false" className="light-img" src={imageCache.current["popLight"]?.src} alt="pang" />
                        <img draggable="false" className="dark-img" src={imageCache.current["popDark"]?.src} alt="pang" />
                        <p>Trykk på skjermen for å starte på nytt!</p>
                    </div>
                    <div id="spacing"></div>
                    <div id="spacing"></div>
                </div>
            )}
        </div>
    );
}

export default Game5;
