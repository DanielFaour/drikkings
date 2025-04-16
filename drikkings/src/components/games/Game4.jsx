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

    const clickRef = useRef(null);

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

    // const handlePointerDown = () => {
    //     const touchZone = document.getElementById("touchZone");
    //     let timeOutRef;

    //     if (timeOutRef) {
    //         clearTimeout(timeOutRef); // Clear the previous timeout
    //     }

    //     timeOutRef = setTimeout(() => {
    //         const activeTouchCount = Object.keys(activeTouches).length;
    //         console.log("Active touches count:", activeTouchCount);
    //         touchZone.style.backgroundColor = "grey";
    //         console.log("activated");

    //         // Remove the background color after some time
    //         setTimeout(() => {
    //             touchZone.style.backgroundColor = "";
    //             console.log("deactivated");
    //         }, 5000); // Adjust the time as needed
    //     }, 2000);

    //     return () => {
    //         if (timeOutRef) {
    //             clearTimeout(timeOutRef); // Clear timeout on cleanup
    //         }
    //     };
    // };

    // // Function to get a unique color
    // function getColor() {
    //     // Check how many touches there are
    //     const activeTouchCount = Object.keys(activeTouches).length;

    //     // If there are fewer than 5 touches, return a new color
    //     if (activeTouchCount < colors.length) {
    //         return colors[activeTouchCount];
    //     }
    //     return null; // No more colors available if there are already 5 touches
    // }


    // Function to get a unique color
    function getColor(attempts = 0) {
        const ranColor = randomRange(0, 4);

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
            if (attempts > 20) {
                console.error("Too many recursion attempts, breaking out.");
                return null;  // Or some default behavior
            }

            // Recursively try again with an incremented attempts count
            return getColor(attempts + 1);
        }
    }

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
            <div id="nav"></div>
            <button id="btnReturn" onClick={() => navigate("/")}>⬅️</button>
            <h2 id="g3_title">Color Picker</h2>
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
