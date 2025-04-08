import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./g_styles/game3.css";

function Game3() {
    const navigate = useNavigate();

    const imageCache = useRef({});
    const [currentRotation, setCurrentRotation] = useState(0);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [firstPress, setFirstPress] = useState(false);

    // creates a random number between min and max
    function randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

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

    const spinBottle = () => {
        const bottle = document.getElementById("revBottle");
        const game3Container = document.getElementById("game3Container");

        // set firstPress to true
        if (!firstPress) {
            setFirstPress(true);
        }

        // Generate a random rotation increment between 1 and 8 full rotations
        let rotationIncrement = randomRange(3, 7) * 360 + randomRange(0, 360);

        // Generate random rotationSpeed for more dynamic spins
        // const rotationSpeed = randomRange(3000, 6000);
        const rotationSpeed = 4000;

        // Add a smooth transition for rotation
        bottle.style.transition = `transform ${rotationSpeed}ms ease-out`; // Adjust time for smoother spin

        // Use the previous rotation value to calculate the new one
        setCurrentRotation((prevRotation) => {
            const newRotation = prevRotation + rotationIncrement;

            // Apply the new rotation directly
            bottle.style.transform = `rotate(${newRotation}deg)`;

            return newRotation; // Return the updated value to set the state
        });

        console.log("currentRotation: ", currentRotation);
    };

    //   // Resets the gun to its original position
    //   function resetGun() {
    //     const gun = document.getElementById("revGun");
    //     gun.style.transition = "none";  

    //     if (!gun) return; // Safety check

    //     gun.style.transform = "rotate(0deg)";
    //     setCurrentRotation(0);
    //   }

    return (
        <div className="game" id="game3">
            <button id="btnReturn" onClick={() => navigate("/")}>⬅️</button>
            <h2 id="g3_title">Flasketuten peker på</h2>

            <div id="game3Container" onPointerDown={spinBottle}>
                <div id="revBottle" >

                </div>
                <h3 id="introTextG3" className={firstPress ? "clicked" : ""}>Plasser mobilen midt på bordet, og så trykk på flasken for å spinne den!</h3>
            </div>
            {imagesLoaded || (
                <div id="gameLoad">
                    <h1>Laster inn!</h1>
                </div>
            )}
        </div>
    );
}

export default Game3;
