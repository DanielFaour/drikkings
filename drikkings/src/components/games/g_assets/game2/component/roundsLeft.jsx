import React from 'react';

const RoundsLeft = ({ rounds }) => {
    return (
        <>
            {
                Array.from({ length: 6 }).map((_, i) => (
                    i < rounds ? (
                        <div id="roundVisual" key={i} className='firedRoundVisual' style={{
                            backgroundColor: "#10c400"
                        }}></div>
                    ) : (
                        <div id="roundVisual" key={i}></div>
                    )
                    // <div id="roundVisual" key={i}>X</div>
                ))
            }
        </>
    );
};

export default RoundsLeft;