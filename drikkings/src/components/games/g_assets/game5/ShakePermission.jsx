import { useEffect, useState } from 'react';

export default function MotionPermissionTest() {
  const [granted, setGranted] = useState(false);

  const requestPermission = async () => {
    const bottle = document.getElementById("permissionBtn");
    bottle.style.filter = "brightness(1)";

    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
      try {
        const result = await DeviceMotionEvent.requestPermission();
        if (result === 'granted') {
          setGranted(true);
        //   alert('Permission granted! ✅');
        } else {
          alert('Tillatelse avslått ❌ Prøv igjen senere eller slett nettleserdata!');
        }
      } catch (e) {
        alert('Error: ' + e.message);
      }
    } else {
    //   alert('No permission API available – likely not iOS or too old.');
        setGranted(true);
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      if (typeof DeviceMotionEvent?.requestPermission === 'function') {
        try {
          const result = await DeviceMotionEvent.requestPermission();
          if (result === 'granted') {
            setGranted(true);
          }
        } catch (e) {
          console.error('Error checking permission:', e.message);
        }
      }
    };
    checkPermission();
  }, []);

  function pointerDown () {
    const bottle = document.getElementById("permissionBtn");
    bottle.style.filter = "brightness(0.8)";
  }

  return (
    <div id="permissionContainer">
        {!granted && (
            <button onPointerUp={requestPermission} onPointerDown={pointerDown} id='permissionBtn'>
            {granted ? '✅ Motion Enabled' : 'Gi tillatelse til bevegelsessensor'}
          </button>
        )}
    </div>
  );
}
