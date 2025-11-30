import { useEffect, useState } from "react";

interface StarProps {
  lit: boolean;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Star({ lit, size = "lg", className = "" }: StarProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (lit) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lit]);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        relative flex items-center justify-center
        ${className}
      `}
      data-testid="magical-star"
    >
      <svg
        viewBox="0 0 100 100"
        className={`
          w-full h-full
          transition-all duration-1000
          ${lit ? "animate-star-light" : "opacity-40"}
          ${isAnimating ? "animate-glow-pulse" : ""}
        `}
      >
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={lit ? "#fcd34d" : "#9ca3af"} />
            <stop offset="50%" stopColor={lit ? "#fbbf24" : "#6b7280"} />
            <stop offset="100%" stopColor={lit ? "#f59e0b" : "#4b5563"} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation={lit ? "4" : "0"} result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <polygon
          points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35"
          fill="url(#starGradient)"
          filter={lit ? "url(#glow)" : ""}
          className="transition-all duration-500"
        />
        {lit && (
          <>
            <circle cx="35" cy="40" r="4" fill="#dc2626" opacity="0.9" />
            <circle cx="65" cy="40" r="4" fill="#a855f7" opacity="0.9" />
            <circle cx="50" cy="65" r="4" fill="#3b82f6" opacity="0.9" />
            <circle cx="42" cy="55" r="4" fill="#eab308" opacity="0.9" />
          </>
        )}
      </svg>
      {lit && (
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-6 bg-gradient-to-t from-amber-400/0 to-amber-400/80 rounded-full"
              style={{
                transform: `rotate(${i * 45}deg) translateY(-40px)`,
                animation: `twinkle 2s ease-in-out infinite ${i * 0.25}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
