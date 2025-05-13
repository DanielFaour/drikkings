import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Howl, Howler } from "howler";
import "./g_styles/game5.css";
import { v4 as uuidv4 } from 'uuid';
import ShakePermission from "./g_assets/game5/ShakePermission";
import Bubbles from "./g_assets/game5/Bubbles";
import popSound from "./g_assets/sounds/game5/bottle_pop.mp3";
import shakeSound from "./g_assets/sounds/game5/shake.mp3";
import shakeSound2 from "./g_assets/sounds/game5/shake.mp3";
import { useMemo } from "react";

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
    const [gameFinish, setGameFinish] = useState(false);
    const [gameStart, setGameStart] = useState(false);
    const [randomShakeOffset, setRandomShakeOffset] = useState(0);

    const [popSoundPlayed, setPopSoundPlayed] = useState(false);
    const [shakeSoundPlayed, setShakeSoundPlayed] = useState(false);

    const [bubbles, setBubbles] = useState([]);
    const activeBubblesRef = useRef(new Set());

    const MAX_BUBBLES = 40; // Limit the maximum number of bubbles

    // make sure that audio is active
    useEffect(() => {
        const resumeAudio = () => {
            if (Howler.ctx && Howler.state === 'suspended') {
                Howler.ctx.resume();
            }
        };


        const onVisibilityChange = () => { // check audio active after returning to page from idle or other apps
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

    const shakeSFX1 = useRef();
    const shakeSFX2 = useRef();
    const popSFX = useRef();

    // load sound
    useEffect(() => {
        shakeSFX1.current = new Howl({
            src: [shakeSound],
            rate: 1,
            volume: 2.2,
            html5: false,
            preload: true
        });
        shakeSFX2.current = new Howl({
            src: [shakeSound2],
            rate: 1,
            volume: 2.2,
            html5: false,
            preload: true
        });
        popSFX.current = new Howl({
            src: [popSound],
            rate: 1,
            volume: 2.5,
            html5: false,
            preload: true
        });
    }, []);

    // play shake sound
    useEffect(() => {
        if (gameFinish || !gameStart) {
            return;
        }

        if (shake == 1) {
            shakeSFX2.current?.rate(randomDecimal(0.5, 0.8));
            shakeSFX2.current?.play?.();
        } else if (shake == -1) {
            shakeSFX1.current?.rate(randomDecimal(0.5, 0.8));
            shakeSFX1.current?.play?.();
        }
    }, [shake])

    // creates a random desimal between min and max
    function randomDecimal(min, max) {
        return Math.random() * (max - min) + min;
    }

    // play end sound
    useEffect(() => {
        if (gameFinish) {
            popSFX.current?.play?.();
        }
    }, [gameFinish])

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
        if (game5bg) {
            game5bg.style.transition = "0.2s";
        }

        const y = event.acceleration.y;

        // register shakes
        if (y > 15) {
            setShake(1);
        } else if (y < -15) {
            setShake(-1);
        } else {
            setShake(0);
        }
    }

    // event listener for motion movement
    window.addEventListener("devicemotion", handleMotionEvent, true);

    useEffect(() => {
        // const shakeText = document.getElementById("shakeData");
        const bottle = document.getElementById("bottleShake");

        // if (!bottle || !shakeText) return; // Add null checks

        if (gameFinish) {
            return;
        }

        if (randNum == null) {
            setRandNum(randomRange(25, 250));
            setRandLoss(randomRange(25, 350));
            setRandomShakeOffset(randomRange(-25, 25));
        }

        if (shake === 1 || shake === -1) {
            setShakeCounter((prevCounter) => prevCounter + 1);
        }

        const prosentShake = Math.floor((shakeCounter / randNum) * 100);

        if (bottle) {
            if (prosentShake >= 85 + randomShakeOffset) {
                setBottleShake(0.1);
            } else if (prosentShake >= 60 + randomShakeOffset) {
                setBottleShake(0.3);
            } else if (prosentShake >= 40 + randomShakeOffset) {
                setBottleShake(0.5);
            } else if (prosentShake >= 20 + randomShakeOffset) {
                setBottleShake(1);
            } else if (shake > 0) {
                setBottleShake(2);
            }
        }

        if ((shakeCounter > randLoss || shakeCounter > randNum) && !gameFinish) {
            bottle.style.animation = "none";
            setGameFinish(true);
            setShakeCounter(0);
        }

        if (clickTextRef.current) {
            clickTextRef.current.style.opacity = "0";
        }
    }, [shake]);

    useEffect(() => {
        if (bubbles.length < MAX_BUBBLES && shake !== 0) {
            addBubble(randomDecimal(2, 4), randomDecimal(0.5, 1.5), randomDecimal(0.5, 1.5));
        }
    }, [shake]);

    // function for shaking the bottle
    function setBottleShake(x) {
        const bottle = document.getElementById("bottleShake");
        if (bottle) {
            bottle.style.animation = `shake ${x}s infinite`;
        }
    }

    function resetGame() {
        // const shakeText = document.getElementById("shakeData");
        const bottle = document.getElementById("bottleShake");
        const game5Pop = document.getElementById("game5Pop");
        const endText = document.getElementById("endText");

        if (bottle) bottle.style.animation = "0";
        // if (shakeText) shakeText.innerHTML = 0;
        if (game5Pop) game5Pop.style.display = "none";
        if (endText) endText.style.display = "none";

        setRandNum(randomRange(25, 250));
        setRandLoss(randomRange(25, 350));
        setRandomShakeOffset(randomRange(-15, 15));
        setShakeCounter(0);
        setGameFinish(false);
        setBubbles([]);

        if (clickTextRef.current) {
            clickTextRef.current.style.opacity = "1";
        }
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
            const game5Pop = document.getElementById("game5Pop");
            const endText = document.getElementById("endText");
            if (endText) endText.style.display = "block";
            if (game5Pop) {
                game5Pop.style.animation = "comeIn 0.7s forwards";
                game5Pop.style.display = "block";
            }

            setCanRestart(false);
            const timeout = setTimeout(() => setCanRestart(true), 700);

            return () => clearTimeout(timeout);
        }
    }, [gameFinish]);

    const handlePointerUp = () => {
        if (canRestart) {
            resetGame();
        }
    };

    function clickEnd() {
        setGameFinish(true);
    }

    function startGame() {
        setGameStart(true);
    }

    // help from gpt
    const addBubble = (speed, swiggle, scale) => {
        if (!gameFinish && gameStart)
        {if (activeBubblesRef.current.size >= MAX_BUBBLES) return; // Prevent adding more bubbles than the limit

        const id = uuidv4(); // Generate a unique ID
        const bubble = <Bubbles bubbleSpeed={speed} swiggleSpeed={swiggle} size={scale} key={id} />;
        setBubbles((prevBubbles) => [...prevBubbles, { id, bubble }]);

        activeBubblesRef.current.add(id); // Track active bubbles
        const bubbleLifetime = speed * 1000;

        setTimeout(() => {
            activeBubblesRef.current.delete(id); // Remove from active bubbles
            setBubbles((prevBubbles) => prevBubbles.filter((b) => activeBubblesRef.current.has(b.id)));
        }, bubbleLifetime);}
    };

    return (
        <div className="game" id="game5">
            <div id="nav">
                <button id="btnReturn" onPointerUp={() => navigate("/")}>⬅️</button>
                <h2 id="g3_title">Shake it</h2>
            </div>
            <div id="game5Container">
                <p id="clickTextGame5" ref={clickTextRef}>
                    Hint: Rist mobilen for å riste flasken!
                </p>
                <div id="game5bg">
                    <ShakePermission />
                    {/* <p id="shakeData"></p> */}
                    <img draggable="false" id="bottleShake" src={imageCache.current["bottle"]?.src} alt="bottle" />
                </div>
            </div>

            {bubbles.map((b) => b.bubble)}

            {!imagesLoaded && (
                <div id="gameLoad">
                    <h1>Laster inn!</h1>
                </div>
            )}

            {!gameStart && (
                <div id="gameLoad" onPointerUp={() => { startGame(); }}>
                    <h1>Trykk for å starte</h1>
                </div>
            )}

            {gameFinish && (
                <div id="game5End" onPointerUp={handlePointerUp}>
                    <div id="spacing"></div>
                    <div id="game5Pop">
                        <img draggable="false" className="light-img" src={imageCache.current["popLight"]?.src} alt="pang" />
                        <img draggable="false" className="dark-img" src={imageCache.current["popDark"]?.src} alt="pang" />
                        <p id="endText">Trykk på skjermen for å starte på nytt!</p>
                    </div>
                    <div id="spacing"></div>
                    <div id="spacing"></div>
                </div>
            )}
        </div>
    );
}

export default Game5;
