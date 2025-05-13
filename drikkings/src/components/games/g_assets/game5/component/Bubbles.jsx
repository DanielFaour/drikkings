import React from 'react';

const Bubbles = ({ bubbleSpeed, swiggleSpeed, size}) => {
    // creates a random number between min and max
    function randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const bubbleStyle = {
        animation: `animateBubble ${bubbleSpeed}s  linear, swiggle  ${swiggleSpeed}s ease-in-out infinite alternate`,
        scale: `${size}`,
        left: `${randomRange(0, 100)}vw`,
        zIndex: `${size > 1 ? 350 : 250}`
    };

    return (
            <div id="bubble" style={bubbleStyle}></div>
    );
};


export default Bubbles;
