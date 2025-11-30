import { Heart, Camera, Shield, Users, Sparkles } from "lucide-react";
import { type CrystalType, crystalInfo } from "@shared/schema";

const crystalIcons: Record<CrystalType, typeof Heart> = {
  kindness: Heart,
  memories: Camera,
  courage: Shield,
  unity: Users,
};

const crystalColors: Record<CrystalType, string> = {
  kindness: "from-pink-400 to-rose-500 dark:from-pink-500 dark:to-rose-600",
  memories: "from-purple-400 to-violet-500 dark:from-purple-500 dark:to-violet-600",
  courage: "from-sky-400 to-blue-500 dark:from-sky-500 dark:to-blue-600",
  unity: "from-amber-400 to-yellow-500 dark:from-amber-500 dark:to-yellow-600",
};

const crystalGlows: Record<CrystalType, string> = {
  kindness: "shadow-pink-500/50 dark:shadow-pink-400/40",
  memories: "shadow-purple-500/50 dark:shadow-purple-400/40",
  courage: "shadow-sky-500/50 dark:shadow-sky-400/40",
  unity: "shadow-amber-500/50 dark:shadow-amber-400/40",
};

interface CrystalDisplayProps {
  type: CrystalType;
  collected: boolean;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animate?: boolean;
  onClick?: () => void;
}

export function CrystalDisplay({
  type,
  collected,
  size = "md",
  showLabel = false,
  animate = false,
  onClick,
}: CrystalDisplayProps) {
  const Icon = crystalIcons[type];
  const info = crystalInfo[type];

  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-28 h-28",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`flex flex-col items-center gap-2 ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      data-testid={`crystal-display-${type}`}
    >
      <div
        className={`
          ${sizeClasses[size]}
          rounded-2xl flex items-center justify-center
          transition-all duration-500
          ${collected
            ? `bg-gradient-to-br ${crystalColors[type]} shadow-lg ${crystalGlows[type]} ${animate ? "animate-crystal-collect" : ""}`
            : "bg-muted/50 dark:bg-muted/30 border-2 border-dashed border-border"
          }
        `}
      >
        {collected ? (
          <Icon className={`${iconSizes[size]} text-white drop-shadow-sm`} />
        ) : (
          <Sparkles className={`${iconSizes[size]} text-muted-foreground/40`} />
        )}
      </div>
      {showLabel && (
        <span
          className={`
            text-sm font-medium text-center font-display
            ${collected ? "text-foreground" : "text-muted-foreground"}
          `}
        >
          {info.name.replace("Crystal of ", "")}
        </span>
      )}
    </div>
  );
}

interface CrystalCollectionProps {
  crystals: Record<CrystalType, boolean>;
  size?: "sm" | "md" | "lg";
}

export function CrystalCollection({ crystals, size = "md" }: CrystalCollectionProps) {
  const types: CrystalType[] = ["kindness", "memories", "courage", "unity"];

  return (
    <div
      className="flex items-center justify-center gap-4 flex-wrap"
      data-testid="crystal-collection"
    >
      {types.map((type) => (
        <CrystalDisplay
          key={type}
          type={type}
          collected={crystals[type]}
          size={size}
          showLabel
        />
      ))}
    </div>
  );
}
