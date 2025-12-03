import { useEffect, useRef } from "react";
import { useGame } from "@/lib/game-context";
import { SceneWrapper } from "@/components/game/SceneWrapper";
import { GameButton } from "@/components/game/GameButton";
import { GratitudeMusic } from "@/components/game/GratitudeMusic";
import { Sparkles, Heart, RefreshCw } from "lucide-react";

export default function GratitudePage() {
  const { goToChapter } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  
  /**
   * Функция для отрисовки всей открытки на Canvas
   */
  const renderCard = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Установка разрешения: физические пиксели
    const dpr = window.devicePixelRatio || 1;
    const { offsetWidth, offsetHeight } = canvas;
    
    // Временно увеличиваем размер, чтобы Canvas был четким при скачивании
    // Используем dpr для адаптации к Retina, но для скачивания лучше установить фиксированное высокое разрешение
    const targetWidth = offsetWidth;
    const targetHeight = offsetHeight;
    canvas.width = targetWidth * dpr;
    canvas.height = targetHeight * dpr;
    
    ctx.scale(dpr, dpr);

    const width = targetWidth;
    const height = targetHeight;
    const centerX = width / 2;

    // --- 1. ФОН: Глубокий бордово-зеленый градиент с золотистыми искрами ---
    const bgGradient = ctx.createRadialGradient(centerX, height / 2, 0, centerX, height / 2, width);
    bgGradient.addColorStop(0, "#2c0e0e"); // Почти черный центр
    bgGradient.addColorStop(0.5, "#421818"); // Темно-бордовый
    bgGradient.addColorStop(1, "#2c0e0e"); 
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Золотистые искры / шум
    ctx.fillStyle = "rgba(212, 175, 55, 0.08)";
    for (let i = 0; i < 150; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 1.5 + 0.5;
      ctx.fillRect(x, y, size, size);
    }
    
    // --- 2. ЭЛЕГАНТНАЯ ЗОЛОТАЯ РАМКА ---
    const border = 18;
    const innerBorder = 25;
    
    // Внешняя тень для эффекта глубины
    ctx.shadowColor = 'rgba(212, 175, 55, 0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Внешняя золотая рамка (линия)
    ctx.strokeStyle = "#d4af37"; // Золотой
    ctx.lineWidth = 2;
    ctx.strokeRect(border, border, width - border * 2, height - border * 2);

    ctx.shadowBlur = 0; // Сброс тени
    
    // Внутренняя рамка (декоративный эффект)
    ctx.strokeStyle = "rgba(212, 175, 55, 0.3)"; 
    ctx.lineWidth = 1;
    ctx.strokeRect(innerBorder, innerBorder, width - innerBorder * 2, height - innerBorder * 2);

    // --- 3. ДЕКОРАТИВНЫЕ ЭЛЕМЕНТЫ: ВЕТВИ И СНЕЖИНКИ ---
    
    // Функция для отрисовки золотой точки
    const drawDot = (x: number, y: number, radius: number) => {
        ctx.fillStyle = "#d4af37";
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    };

    // Функция для отрисовки стилизованной ветви/завитка
    const drawSwirl = (x: number, y: number, scaleX: number, scaleY: number, rotation: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(scaleX, scaleY);
        
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        
        // Основная линия
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(15, -15, 30, 0);
        ctx.quadraticCurveTo(45, 15, 60, 0);
        ctx.stroke();

        // Листики/точки
        drawDot(30, 0, 1.5);
        drawDot(60, 0, 2);

        ctx.restore();
    };

    // Угловые завитки
    drawSwirl(border + 5, border + 5, 1, 1, 0.7);
    drawSwirl(width - border - 5, border + 5, -1, 1, -0.7);
    drawSwirl(border + 5, height - border - 5, 1, -1, 0.7);
    drawSwirl(width - border - 5, height - border - 5, -1, -1, -0.7);
    
    // Снежинки по углам
    const drawSnowflake = (x: number, y: number, size: number, color: string) => {
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.moveTo(x + Math.cos(angle) * size, y + Math.sin(angle) * size);
            ctx.lineTo(x + Math.cos(angle + Math.PI) * size, y + Math.sin(angle + Math.PI) * size);
        }
        ctx.stroke();
        drawDot(x, y, 1.5);
    };

    drawSnowflake(50, 50, 7, "rgba(255, 255, 255, 0.6)");
    drawSnowflake(width - 50, 50, 7, "rgba(255, 255, 255, 0.6)");
    drawSnowflake(50, height - 50, 7, "rgba(255, 255, 255, 0.6)");
    drawSnowflake(width - 50, height - 50, 7, "rgba(255, 255, 255, 0.6)");

    // --- 4. ТЕКСТ ПОЗДРАВЛЕНИЯ ---
    
    const textPadding = 40;
    const textWidth = width - textPadding * 2;
    let currentY = 110;
    const lineHeight = 20;

    // Заголовок
    ctx.font = `bold 40px "Playfair Display", serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#ffd700"; // Золотой
    ctx.fillText("С Новым годом!", centerX, 60);

    // Разделитель
    ctx.strokeStyle = "#d4af37";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(centerX - 100, 85);
    ctx.lineTo(centerX + 100, 85);
    ctx.stroke();
    
    // Основное поздравление (многострочный текст)
    const messages = [
      "Айназик,",
      "",
      "хочу, чтобы следующий год принес тебе столько радости,",
      "сколько ты даришь окружающим каждый день.",
      "Пусть каждый день будет наполнен улыбками, теплом",
      "и маленькими чудесами, которые делают жизнь ярче.",
      "",
      "Ты очень открытая, добрая и лучезарная девушка,",
      "поэтому мне хотелось бы чаще общаться с тобой.",
      "Я создал этот сайт специально для тебя, чтобы показать,",
      "как много для меня значит твоя улыбка, твоя доброта",
      "и всё, что делает тебя особенной.",
      "",
      "В следующем году нас ждёт много перемен.",
      "Мы покинем школу и начнем новую главу жизни,",
      "поэтому желаю тебе успешной сдачи экзаменов, ",
      "поступления в желанный ВУЗ и успешного старта в дальнейшем.",
      "",
      "Пусть у тебя будет смелость, вдохновение,",
      "радость от каждого достижения и поддержка близких.",
      "",
      "Счастливого Нового года! 🥂",
    ];
    
    messages.forEach((msg) => {
      if (msg === "") {
        currentY += lineHeight / 2;
      } else {
        if (msg.includes("Айназик") || msg.includes("Счастливого Нового года!")) {
          ctx.font = `bold 16px "Montserrat", sans-serif`;
          ctx.fillStyle = "#ffd700";
        } else {
          ctx.font = `15px "Montserrat", sans-serif`;
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        }
        
        ctx.fillText(msg, centerX, currentY);
        currentY += lineHeight;
      }
    });

    // Подпись
    currentY += 15;
    ctx.font = `italic 15px "Montserrat", sans-serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText("С теплом и улыбкой,", centerX, currentY + 30);
    ctx.font = `bold italic 18px "Playfair Display", serif`;
    ctx.fillStyle = "#ffd700";
    ctx.fillText("Алдияр", centerX, currentY + 55);
  };


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Изначальная отрисовка
    renderCard(canvas);

    // Отрисовка при изменении размера окна
    const handleResize = () => {
      renderCard(canvas);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handlePlayAgain = () => {
    goToChapter("start");
  };

  return (
    <SceneWrapper backgroundClass="bg-gradient-to-b from-red-900 via-red-950 to-green-950">
      <GratitudeMusic />
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
        {/* Заголовок */}
        <div className="animate-fade-in-up mb-8">
          <div className="flex items-center gap-3 justify-center mb-6">
            <Sparkles className="w-8 h-8 text-amber-400 animate-twinkle" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-amber-100">
              Спасибо за игру!
            </h1>
            <Sparkles className="w-8 h-8 text-amber-400 animate-twinkle" />
          </div>
        </div>

        {/* Canvas для открытки */}
        <div className="w-full max-w-2xl animate-fade-in-up">
          <canvas
            ref={canvasRef}
            // Адаптивный дизайн: w-full, но с ограничением max-w-2xl
            className="w-full h-auto rounded-2xl shadow-2xl border border-amber-500/30"
            // Фиксированное соотношение сторон для открытки
            style={{ aspectRatio: "4 / 5" }} 
          />
        </div>

        {/* Кнопки и подпись */}
        <div className="flex flex-col items-center gap-6 mt-8 animate-fade-in-up max-w-2xl">
          <div className="flex items-center gap-2 text-amber-200 text-sm">
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <GameButton onClick={handlePlayAgain} size="lg" icon="restart">
              Начать заново
            </GameButton>
          </div>
        </div>
      </div>
    </SceneWrapper>
  );
}