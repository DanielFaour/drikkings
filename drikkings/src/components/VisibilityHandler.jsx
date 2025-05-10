import { useEffect } from "react";
import { Howler } from "howler";

function VisibilityHandler() {
  useEffect(() => {
    let resumeTimeout;

    const resumeAudioContext = async () => {
      try {
        const ctx = Howler.ctx;
        if (ctx && ctx.state === "suspended") {
          await ctx.resume();
        }

        // Preload any non-playing sounds
        Howler._howls.forEach((sound) => {
          if (!sound.playing()) {
            sound.load();
          }
        });
      } catch (error) {
        console.error("Audio resume error:", error);
        window.location.href = "/";
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resumeAudioContext();

        resumeTimeout = setTimeout(() => {
          if (Howler.ctx.state !== "running") {
            window.location.href = "/";
          }
        }, 200);
      }
    };

    const handleUserInteraction = () => {
      resumeAudioContext();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    // On load, try to resume after user interaction
    document.addEventListener("click", handleUserInteraction, { once: true });
    document.addEventListener("touchstart", handleUserInteraction, { once: true });

    // Also listen for tab visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
      clearTimeout(resumeTimeout);
    };
  }, []);

  return null;
}

export default VisibilityHandler;
