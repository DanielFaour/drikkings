import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./g_styles/game4.css";
import { v4 as uuidv4 } from 'uuid';

function Game4() {
    const navigate = useNavigate();
    const imageCache = useRef({});
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const [activeTouches, setActiveTouches] = useState({});
    const isDragging = useRef(false);

    // red, blue, green, yellow, purple
    const colors = ["#FF4C4C", "#4C9AFF", "#4CFF91", "#FFC94C", "#C04CFF"];
    const [selectedColors, setSelectedColors] = useState([]);

    const [gameActive, setGameActive] = useState(false);
    const [currentTouches, setCurrentTouches] = useState(0);
    const [colorBackgroundActive, setcolorBackgroundActive] = useState(false);

    // check if images loaded
    useEffect(() => {
        const imagePaths = {};

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

    // Function to get a unique color
    function getColor(attempts = 0) {
        const ranColor = randomRange(0, 4);
        const touchZone = document.getElementById("touchZone");

        // Check if the color is already in selectedColors, and ensure fewer than 5 colors are selected
        if (!selectedColors.includes(ranColor)) {
            // Use callback to access the most recent state and add the color
            setSelectedColors((prev) => {
                const updatedColors = [...prev, ranColor];
                return updatedColors;  // Return the new state
            });

            return colors[ranColor];  // Return the color based on the random index
        } else {
            // Prevent too much recursion by limiting the number of attempts
            if (attempts > 25) {
                console.error("Too many recursion attempts, breaking out.");
                // touchZone.style.backgroundColor = "brown";
                return null;  // Or some default behavior
            }

            // Recursively try again with an incremented attempts count
            return getColor(attempts + 1);
        }
    }

    // game activation on and off
    useEffect(() => {
        const activeTouchCount = Object.keys(activeTouches).length
        const touchZone = document.getElementById("touchZone");
        const ruleText = document.getElementById("ruleText");


        if (!gameActive && activeTouchCount > 1) {
            setGameActive(true);
        } else if (gameActive && activeTouchCount == 0) {
            setGameActive(false);
        }

        // user response based on input count
        switch (activeTouchCount) {
            case 1:
                ruleText.innerHTML = "1/5 spillere";
                setCurrentTouches(1);
                break;
            case 2:
                ruleText.innerHTML = "2/5 spillere";
                setCurrentTouches(2);
                break;
            case 3:
                ruleText.innerHTML = "3/5 spillere";
                setCurrentTouches(3);
                break;
            case 4:
                ruleText.innerHTML = "4/5 spillere";
                setCurrentTouches(4);
                break;
            case 5:
                ruleText.innerHTML = "5/5 spillere";
                setCurrentTouches(5);
                break;
            default:
                ruleText.innerHTML = "2-5 spillere";
                setCurrentTouches(0);
            // setcolorBackgroundActive(false);
        }
    }, [activeTouches]);

    // here the magic happens - changes the game based on which rules are reached
    useEffect(() => {
        const touchZone = document.getElementById("touchZone");
        const activeTouchCount = Object.keys(activeTouches).length;
        let timeOutRef;

        const color = selectedColors[randomRange(0, Object.keys(activeTouches).length - 1)];

        console.log("active touch:", Object.keys(activeTouches).length);
        // console.log("selected color:", selectedColors[0]);

        if (timeOutRef) {
            clearTimeout(timeOutRef); // Clear the previous timeout
        }

        if (gameActive && !colorBackgroundActive && activeTouchCount > 1) {
            timeOutRef = setTimeout(() => {
                setcolorBackgroundActive(true);
                touchZone.style.backgroundColor = colors[color];
                console.log("activated");
                // // Remove the background color after some time
                // setTimeout(() => {
                //     touchZone.style.backgroundColor = "";
                //     console.log("deactivated");
                // }, 2000); // Adjust the time as needed
            }, 2000);

            return () => {
                if (timeOutRef) {
                    clearTimeout(timeOutRef); // Clear timeout on cleanup
                }
            };
        }

        if (!gameActive && activeTouchCount == 0) {
            setcolorBackgroundActive(false);
            setTimeout(() => {
                touchZone.style.backgroundColor = "";
                console.log("deactivated");
            }, 500); // Adjust the time as needed
        }


    }, [gameActive, currentTouches]);

    // touch event listener
    useEffect(() => {
        const touchZone = document.getElementById("touchZone");
        // handles pointer down
        const handlePointerDown = (event) => {

            isDragging.current = true;
            // Get a unique color for this touch
            const color = getColor();

            setActiveTouches((prev) => ({
                ...prev,
                [event.pointerId]: {
                    x: event.clientX,
                    y: event.clientY,
                    id: uuidv4(),
                    color: color,
                },
            }));
        };

        // handles pointer drag/move
        const handlePointerMove = (event) => {
            setActiveTouches((prev) => {
                if (!prev[event.pointerId] && !isDragging.current) return prev;
                return {
                    ...prev,
                    [event.pointerId]: {
                        ...prev[event.pointerId],
                        x: event.clientX,
                        y: event.clientY,
                    }
                };
            });
        };

        // handles pointer up or cancel
        const handlePointerUpOrCancel = (event) => {
            isDragging.current = false;

            setActiveTouches((prev) => {
                const newState = { ...prev };
                const removedTouch = newState[event.pointerId]; // Get the removed touch data
                delete newState[event.pointerId]; // Remove the touch from activeTouches

                // Remove the color associated with the touch from selectedColors
                if (removedTouch) {
                    const colorIndex = selectedColors.indexOf(colors.indexOf(removedTouch.color));
                    if (colorIndex !== -1) {
                        setSelectedColors((prevSelectedColors) => {
                            const newColors = [...prevSelectedColors];
                            newColors.splice(colorIndex, 1); // Remove color from selected colors
                            return newColors;
                        });
                    }
                }

                return newState;
            });
        };

        if (touchZone) {
            touchZone.addEventListener("pointerdown", handlePointerDown);
            touchZone.addEventListener("pointermove", handlePointerMove);
            touchZone.addEventListener("pointerup", handlePointerUpOrCancel);
            touchZone.addEventListener("pointercancel", handlePointerUpOrCancel);
        }

        return () => {
            if (touchZone) {
                touchZone.removeEventListener("pointerdown", handlePointerDown);
                touchZone.removeEventListener("pointermove", handlePointerMove);
                touchZone.removeEventListener("pointerup", handlePointerUpOrCancel);
                touchZone.removeEventListener("pointercancel", handlePointerUpOrCancel);
            }
        };
    }, [activeTouches]);

    return (
        <div className="game" id="game4">
            <div id="nav">
                <button id="btnReturn" onClick={() => navigate("/")}>⬅️</button>
                <h2 id="g3_title">Color Picker</h2>
            </div>
            <p id="ruleText">Maks 5 spillere</p>

            <div id="game4Container">
                <div id="touchZone">
                    {Object.values(activeTouches).map((touch) => (
                        <div
                            key={touch.id}
                            className="touchSpot"
                            style={{
                                left: `${touch.x}px`,
                                top: `${touch.y}px`,
                                backgroundColor: `${touch.color}`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {!imagesLoaded && (
                <div id="gameLoad">
                    <h1>Laster inn!</h1>
                </div>
            )}
        </div>
    );
}

export default Game4;
