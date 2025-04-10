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

    let isSpinning = false;

    const spinBottle = () => {
        if (isSpinning) return; // Prevents multiple spins at the same time
    
        isSpinning = true;
    
        const bottle = document.getElementById("revBottle");
    
        // Set firstPress to true
        if (!firstPress) {
            setFirstPress(true);
        }
    
        // Generate a random rotation increment
        let rotationIncrement = (randomRange(2, 5) * 360) + randomRange(0, 360);
    
        // Generate random rotationSpeed for more dynamic spins, for now it's a fixed value
        const rotationSpeed = 4000;
    
        // Add a smooth transition for rotation
        bottle.style.transition = `transform ${rotationSpeed}ms ease-out`;
    
        // Use requestAnimationFrame for smoother updates
        const spin = () => {
            setCurrentRotation((prevRotation) => {
                const newRotation = prevRotation + rotationIncrement;
                console.log("New rotation:", newRotation);
    
                // Apply the new rotation directly
                bottle.style.transform = `rotate(${newRotation}deg)`;
    
                return newRotation; // Return the updated value to set the state
            });
    
            // Wait until the rotation is finished before allowing another spin
            setTimeout(() => {
                isSpinning = false; // Allow another spin after the transition is complete
            }, rotationSpeed); // Matches the rotation speed (in ms)
        };
    
        requestAnimationFrame(spin); // Call the spin function
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
                <div id="spacingTop"></div>
                <img draggable="false" id="revBottle" src={imageCache.current["bottle"]?.src} alt="bottle" />
                <h3 id="introTextG3" className={firstPress ? "clicked" : ""}>Plasser mobilen midt på bordet, og så trykk på flasken for å spinne den!</h3>
                <div id="spacing"></div>
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
