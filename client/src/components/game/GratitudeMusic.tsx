import { useEffect, useRef } from "react";
import { backgroundMusicInstance } from "./BackgroundMusic";

export function GratitudeMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Плавное увеличение громкости (fade in)
    const fadeIn = (duration = 3500, targetVolume = 0.4) => {
      const startVolume = 0;
      const startTime = Date.now();

      const updateVolume = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        audio.volume = startVolume + (targetVolume - startVolume) * progress;

        if (progress < 1) {
          requestAnimationFrame(updateVolume);
        }
      };

      updateVolume();
    };

    // Отключаем фоновую музыку с fade out
    if (backgroundMusicInstance) {
      const bgAudio = backgroundMusicInstance as any;
      if (bgAudio.fadeOut) {
        bgAudio.fadeOut(1000); // Fade out за 1 секунду
      } else {
        bgAudio.pause();
      }
    }

    // Attempt to play on component mount
    const playAudio = () => {
      audio.play()
        .then(() => {
          // Начинаем fade in после успешного запуска
          fadeIn(2000, 0.4);
        })
        .catch(err => {
          console.log("Gratitude music autoplay blocked, waiting for user interaction:", err);
        });
    };

    // Try autoplay
    playAudio();

    // Fallback: play on first user interaction
    const handleUserInteraction = () => {
      if (audio.paused) {
        playAudio();
      }
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      src="/sounds/gratitude/José Feliciano - Feliz Navidad.mp3"
      preload="auto"
      style={{ display: "none" }}
    />
  );
}
