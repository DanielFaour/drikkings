import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./g_styles/game3.css";

function Game3() {
    const navigate = useNavigate();

    const imageCache = useRef({});

    const [currentRotation, setCurrentRotation] = useState(0);
    const [currentRotationSpeed, setCurrentRotationSpeed] = useState(0);

    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [firstPress, setFirstPress] = useState(false);
    const clickTextRef = useRef(null);
    const timeoutRef = useRef(null);

    // creates a random number between min and max
    function randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // check if images loaded
    useEffect(() => {
        const imagePaths = {
            bottle: new URL("./g_assets/game3/bottle.png", import.meta.url).href,
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

        if (!firstPress) {
            setFirstPress(true);
        }

        // hides hint when bottle is clicked
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

        // Update and apply rotation speed
        const baseRotationSpeed = 3000;
        const newRotationSpeed = currentRotationSpeed + 500;
        setCurrentRotationSpeed(newRotationSpeed);

        const totalSpeed = baseRotationSpeed + newRotationSpeed;

        // Cap speed if it gets too high
        // if (newRotationSpeed > 12000) {
        //     setCurrentRotationSpeed(newRotationSpeed / 2);
        // }

        // Generate a new random degree and save it for the reset
        const newRandomDegree = randomRange(0, 360);
        // Rotation increment for this spin
        const rotationIncrement = (randomRange(3, 5) * 360)

        // // Calculate and apply the new rotation
        const finalRotation = currentRotation + rotationIncrement;

        if (newRotationSpeed > 10000) {
            return;
        }

        if (finalRotation > 40000) {
        } else {
        }
        setCurrentRotation(finalRotation);
        bottle.style.transition = `transform ${totalSpeed}ms cubic-bezier(0.25, 0.30, 0.40, 1)`;
        console.log("r:", finalRotation, "s:", totalSpeed);

        bottle.style.transform = `rotate(${finalRotation + newRandomDegree}deg)`;


        // Handle end of spin
        const onSpinEnd = () => {
            console.log("Spin complete!");

            // Reset state and visual position to clean degree
            setCurrentRotationSpeed(0);
            setCurrentRotation(0);

            // Remove transition before snapping to new clean angle
            bottle.style.transition = "none";
            bottle.style.transform = `rotate(${newRandomDegree}deg)`;

            bottle.removeEventListener("transitionend", onSpinEnd);
        };

        bottle.addEventListener("transitionend", onSpinEnd);
    };



    return (
        <div className="game" id="game3">
            <div id="nav">
                <h2 id="g3_title">Flasketuten peker på</h2>
                <button id="btnReturn" onPointerUp={() => navigate("/")}>⬅️</button>
            </div>
            <p id="clickTextGame3" ref={clickTextRef} className={firstPress ? "clicked" : ""}>
                Hint: Trykk for å spinne flasken!
            </p>

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
