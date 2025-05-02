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
    const [randNum, setRandNum] = useState(null);

    // check if images loaded
    useEffect(() => {
        const imagePaths = {
            bottle: new URL("./g_assets/bottle.png", import.meta.url).href,
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

    const [shakeCounter, setShakeCounter] = useState(0);
    const [shake, setShake] = useState(0);
    const [gameFinish, setGameFinish] = useState(false)

    function handleMotionEvent(event) {
        const game5bg = document.getElementById("game5bg");
        const bottle = document.getElementById("bottleShake");
        game5bg.style.transition = "0.2s";

        const y = event.acceleration.y;

        // register shakes
        if (y > 20) {
            setShake(1);
            bottle.style.backgroundColor = "red";
            // clearTimeout(timeoutRef.current);
            // game5bg.style.backgroundColor = "red";
            // setShakeCounter((prevCounter) => prevCounter + 1);
            // timeoutRef.current = setTimeout(() => {
            //     game5bg.style.backgroundColor = "";
            // }, 1500);
        }
        else if (y < -20)  {
            setShake(-1);
            bottle.style.backgroundColor = "blue";
            // clearTimeout(timeoutRef.current);
            // game5bg.style.backgroundColor = "blue";
            // setShakeCounter((prevCounter) => prevCounter + 1);
            // timeoutRef.current = setTimeout(() => {
            //     game5bg.style.backgroundColor = "";
            // }, 1500);
        } else {
            setShake(0);
        }

        // if (shakeCounter > randomRange(200, 500) && !gameFinish) {
        //     setGameFinish(true);
        // }
    }

    // event listener for motion movement
    window.addEventListener("devicemotion", handleMotionEvent, true);
    
    useEffect(() => {
        const shakeText = document.getElementById("shakeData");

        if (gameFinish) {
            shakeText.innerHTML = 0;
            return;
        }

        if (randNum == null) {
            setRandNum(randomRange(50, 150));
        }

        if (shake == 1) {
            setShakeCounter((prevCounter) => prevCounter + 1);
        } else if (shake == -1) {
            setShakeCounter((prevCounter) => prevCounter + 1);
        }
        
        shakeText.innerHTML = shakeCounter;

        if (shakeCounter > randNum && !gameFinish) {
            setGameFinish(true);
            setShakeCounter(0);
        }
    }, [shake]);

    function resetGame() {
        const shakeText = document.getElementById("shakeData");
        shakeText.innerHTML = 0;
        setRandNum(randomRange(50, 200));
        setShakeCounter(0);
        setGameFinish(false);
    }

    return (
        <div className="game" id="game5">
            <div id="nav">
                <button id="btnReturn" onClick={() => navigate("/")}>⬅️</button>
                <h2 id="g3_title">Shake it</h2>
            </div>
            <div id="game5Container">
                <div id="game5bg">
                    <ShakePermission />
                    <p id="shakeData">0</p>
                    <img draggable="false" id="bottleShake" src={imageCache.current["bottle"]?.src} alt="bottle" />
                </div>
            </div>


            {!imagesLoaded && (
                <div id="gameLoad">
                    <h1>Laster inn!</h1>
                </div>
            )}

            {gameFinish && (
                <div id="gameLoad">
                    <h1>HAHA DU TAPTE!</h1>
                    <button onClick={resetGame}>Start på nytt</button>
                </div>
            )}
        </div>
    );
}

export default Game5;
