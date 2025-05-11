import { useEffect } from "react";
import { Howler } from "howler";

function VisibilityHandler() {
  useEffect(() => {
    let resumeTimeout;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        try {
          const ctx = Howler.ctx;

          // Immediately attempt to resume AudioContext if suspended
          if (ctx && ctx.state === "suspended") {
            await ctx.resume();
          }

          // Restore all Howl instances as soon as the context is resumed
          resumeTimeout = setTimeout(() => {
            Howler._howls.forEach((sound) => {
              // If sound is not playing, load it immediately
              if (!sound.playing()) {
                sound.load();
              }
            });
          }, 50); // Reduced delay

          // Quick fallback: reload if AudioContext still isn't working
          setTimeout(() => {
            if (ctx.state !== "running") {
              window.location.reload(); // Reload the current page
            }
          }, 200); // Reduced fallback time
        } catch (error) {
          console.error("Audio resume error:", error);
          window.location.reload(); // Reload the current page
        }
      }
    };

    const handleFocus = () => {
      console.log("Tab is focused");
      handleVisibilityChange();
    };

    const handleBlur = () => {
      console.log("Tab is blurred");
      handleVisibilityChange();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      clearTimeout(resumeTimeout);
    };
  }, []);

  return null;
}

export default VisibilityHandler;
