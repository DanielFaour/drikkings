import { useState } from 'react';

export default function MotionPermissionTest() {
  const [granted, setGranted] = useState(false);

  const requestPermission = async () => {
    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
      try {
        const result = await DeviceMotionEvent.requestPermission();
        if (result === 'granted') {
          setGranted(true);
          alert('Permission granted! ✅');
        } else {
          alert('Permission denied ❌');
        }
      } catch (e) {
        alert('Error: ' + e.message);
      }
    } else {
      alert('No permission API available – likely not iOS or too old.');
    }
  };

  return (
      <button onClick={requestPermission} id='permissionBtn'>
        {granted ? '✅ Motion Enabled' : 'Enable Motion'}
      </button>
  );
}
