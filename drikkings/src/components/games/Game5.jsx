import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./g_styles/game5.css";
import { v4 as uuidv4 } from 'uuid';
import ShakePermission from "./g_assets/game5/ShakePermission";

function Game5() {
    const navigate = useNavigate();
    const imageCache = useRef({});
    const [imagesLoaded, setImagesLoaded] = useState(false);

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

    async function handleClick () {
        alert("Hey")
    }

    return (
        <div className="game" id="game5">
            <div id="nav">
                <button id="btnReturn" onClick={() => navigate("/")}>⬅️</button>
                <h2 id="g3_title">Shake it</h2>
            </div>
            <div id="game5Container">
                <ShakePermission/>
                <img draggable="false" id="bottleShake" src={imageCache.current["bottle"]?.src} alt="bottle" />
            </div>


            {!imagesLoaded && (
                <div id="gameLoad">
                    <h1>Laster inn!</h1>
                </div>
            )}
        </div>
    );
}

export default Game5;
