import { type ReactNode } from "react";
import { ChevronRight, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "magical";
  size?: "default" | "lg";
  icon?: "next" | "restart" | "sparkle" | "none";
  disabled?: boolean;
  className?: string;
  "data-testid"?: string;
}

export function GameButton({
  children,
  onClick,
  variant = "primary",
  size = "default",
  icon = "next",
  disabled = false,
  className = "",
  "data-testid": testId,
}: GameButtonProps) {
  const baseClasses = "rounded-full font-display transition-all duration-300";

  const variantClasses = {
    primary: "",
    secondary: "",
    magical: "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[shimmer_3s_linear_infinite] text-white border-0",
  };

  const sizeClasses = {
    default: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg",
  };

  const icons = {
    next: <ChevronRight className="w-5 h-5 ml-1" />,
    restart: <RotateCcw className="w-5 h-5 mr-1" />,
    sparkle: <Sparkles className="w-5 h-5 mr-1" />,
    none: null,
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={variant === "magical" ? "default" : variant === "primary" ? "default" : "outline"}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      data-testid={testId}
    >
      {icon === "restart" || icon === "sparkle" ? icons[icon] : null}
      {children}
      {icon === "next" ? icons[icon] : null}
    </Button>
  );
}
