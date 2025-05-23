import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./g_styles/game4.css";
import { v4 as uuidv4 } from 'uuid';
import { Howl } from 'howler';
import bubbleSound from "./g_assets/sounds/game4/bubble.mp3";
import bellSound from "./g_assets/sounds/game4/bell.mp3";


function Game4() {
    const navigate = useNavigate();
    const imageCache = useRef({});
    const [imagesLoaded, setImagesLoaded] = useState(false);

    const [activeTouches, setActiveTouches] = useState({});
    const isDragging = useRef(false);
    const clickTextRef = useRef(null);
    const timeoutRef = useRef(null);

    // red, blue, green, yellow, purple, bonus pink
    const colors = ["#FF4C4C", "#4C9AFF", "#4CFF91", "#FFC94C", "#9A4CFF", "#FF4CDB"];
    const [selectedColors, setSelectedColors] = useState([]);

    const [gameActive, setGameActive] = useState(false);
    const [currentTouches, setCurrentTouches] = useState(0);
    const [colorBackgroundActive, setcolorBackgroundActive] = useState(false);

    const bubbleSoundRef = useRef(null);

    const maxTouches = 5;


    // if sound doesnt work try this, but this doesnt actually work most of the time, 
    // i have a component in app.jsx that fixes that if thats the case
    useEffect(() => {
        const resumeAudio = () => {
            if (Howler.ctx && Howler.state === 'suspended') {
                Howler.ctx.resume();
            }
        };

        const onVisibilityChange = () => {
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


    // play sound on user pointer down 

    useEffect(() => {
        bubbleSoundRef.current = new Howl({
            src: [bubbleSound],
            volume: 0.1,
            preload: true,
        });
    }, []);

    useEffect(() => {

        const touchZone = document.getElementById("touchZone");

        const handlePointerDown = () => {
            // Initialize Howl on first user interaction if needed
            if (!bubbleSoundRef.current) {
                bubbleSoundRef.current = new Howl({
                    src: [bubbleSound],
                    volume: 0.5,
                });
            }

            const sound = bubbleSoundRef.current;
            if (sound && typeof sound.play === 'function') {
                if (currentTouches < maxTouches) {
                    sound.rate(Object.keys(activeTouches).length + 0.5);
                    sound.play();
                }
            }
        };

        if (touchZone) {
            touchZone.addEventListener("pointerdown", handlePointerDown);
        }

        return () => {
            if (touchZone) {
                touchZone.removeEventListener("pointerdown", handlePointerDown);
            }
        };
    }, [currentTouches]);

    // play sound on user pointer down 
    const bellSoundRef = useRef(null);
    useEffect(() => {
        if (!bellSoundRef.current) {
            bellSoundRef.current = new Howl({
                src: [bellSound],
                volume: 0.5,
                rate: 1,
            });
        }

        if (colorBackgroundActive) {
            const sound = bellSoundRef.current;
            if (sound && typeof sound.play === 'function') {
                sound.play();
            }
        }

    }, [colorBackgroundActive]);


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
    function getColor() {
        const availableIndices = colors
            .map((_, index) => index)
            .filter(index => !selectedColors.includes(index));

        if (availableIndices.length === 0) {
            console.warn("No more unique colors available.");
            return null;
        }

        const ranIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];

        setSelectedColors(prev => [...prev, ranIndex]);

        return colors[ranIndex];
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
                ruleText.style.backgroundColor = "red";
                ruleText.style.color = "white";
                setCurrentTouches(1);
                break;
            case 2:
                ruleText.innerHTML = "2/5 spillere";
                ruleText.style.backgroundColor = "green";
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
                ruleText.style.backgroundColor = "";
                ruleText.style.color = "";
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

    useEffect(() => {
        // hides hint when zone is clicked
        if (clickTextRef.current && currentTouches > 0) {
            clickTextRef.current.style.opacity = "0";
        }

        // when click, clear timeout
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            if (clickTextRef.current) {
                clickTextRef.current.style.opacity = "1";
            }
        }, 10000);

    }, [currentTouches])
    

    // touch event listener
    useEffect(() => {
        const touchZone = document.getElementById("touchZone");
        // handles pointer down
        const handlePointerDown = (event) => {
            if (Object.keys(activeTouches).length >= maxTouches) return; // Ignore if current touches exceed maxTouches
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
                if (!prev[event.pointerId] || Object.keys(prev).length > maxTouches) return prev; // Ignore if touch is not active or exceeds maxTouches
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
                const removedTouch = prev[event.pointerId]; // Get the removed touch data
                delete newState[event.pointerId]; // Remove the touch from activeTouches

                // Remove the color associated with the touch from selectedColors
                if (removedTouch) {
                    const colorIndex = colors.indexOf(removedTouch.color); // Find the correct color index
                    if (colorIndex !== -1) {
                        setSelectedColors((prevSelectedColors) => {
                            return prevSelectedColors.filter((index) => index !== colorIndex); // Remove color index
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

    // remove borders once game end
    // useEffect(() => {
    //     const allSpots = document.querySelectorAll('#touchSpot');

    //     allSpots.forEach((el) => {
    //         el.style.border = colorBackgroundActive ? 'none' : 'none';
    //     });

    //   }, [colorBackgroundActive]);

    return (
        <div className="game" id="game4">
            <div id="nav">
                <button id="btnReturn" onPointerUp={() => navigate("/")}>⬅️</button>
                <h2 id="g3_title">Color Picker</h2>
            </div>
            <p id="clickTextGame4" ref={clickTextRef}>
                Hint: Trykk for å få tildelt en farge!
            </p>
            <p id="ruleText">Maks 5 spillere</p>

            <div id="game4Container">
                <div id="touchZone">
                    {Object.values(activeTouches).map((touch) => (
                        <div
                            key={touch.id}
                            id="touchSpot"
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