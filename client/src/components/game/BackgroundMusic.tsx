import { useEffect, useRef } from "react";

// Глобальная переменная для управления фоновой музыкой
export let backgroundMusicInstance: HTMLAudioElement | null = null;

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    backgroundMusicInstance = audio;

    // Функция для плавного увеличения громкости (fade in)
    const fadeIn = (duration = 2000, targetVolume = 0.3) => {
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

    // Функция для плавного уменьшения громкости (fade out)
    const fadeOut = (duration = 1000) => {
      const startVolume = audio.volume;
      const startTime = Date.now();

      const updateVolume = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        audio.volume = startVolume * (1 - progress);

        if (progress < 1) {
          requestAnimationFrame(updateVolume);
        } else {
          audio.pause();
        }
      };

      updateVolume();
    };

    // Сохраняем функции на объект audio для доступа из других компонентов
    (audio as any).fadeIn = fadeIn;
    (audio as any).fadeOut = fadeOut;

    // Устанавливаем начальную громкость на 0 для fade in эффекта
    audio.volume = 0;

    // Обработчик для цикличного воспроизведения
    const handleEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {
        console.log("Failed to play audio on loop");
      });
    };

    // Пытаемся запустить музыку
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Начинаем fade in после успешного запуска
          fadeIn(2000, 0.3);
        })
        .catch(() => {
          console.log("Autoplay blocked by browser - will play on user interaction");
        });
    }

    // Добавляем обработчик для цикла
    audio.addEventListener("ended", handleEnded);

    // Обработчик клика для запуска музыки (если браузер заблокировал автозапуск)
    const handleUserInteraction = () => {
      audio.play().then(() => {
        fadeIn(2000, 0.3);
      }).catch(() => {
        console.log("Failed to play audio");
      });
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("keydown", handleUserInteraction);

    return () => {
      audio.removeEventListener("ended", handleEnded);
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("keydown", handleUserInteraction);
      backgroundMusicInstance = null;
    };
  }, []);

  return (
    <audio
      ref={audioRef}
      preload="auto"
      style={{ display: "none" }}
    >
      <source src={`${import.meta.env.BASE_URL}sounds/background/Christmas Village - Aaron Kenny.mp3`} type="audio/mpeg" />
    </audio>
  );
}
