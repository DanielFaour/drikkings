import React from 'react';



const RoundsLeft = ({ rounds }) => {

    // change text of last chamber
    function lastRound(key) {
        // console.log("test", rounds)
        if (key == 5 && rounds == 5) {
            return true;
        } else {
            return false;
        }
    }

    return (
        <>
            {
                Array.from({ length: 6 }).map((_, i) => (
                    i < rounds ? (
                        <div id="roundVisual" key={i} className='firedRoundVisual' style={{
                            backgroundColor: "#34dd00"
                        }}></div>
                    ) : (
                        <div id="roundVisual" key={i}>{lastRound(i) ? '☠️' : '?'}</div>
                    )
                    // <div id="roundVisual" key={i}>X</div>
                ))
            }
        </>
    );
};

export default RoundsLeft;