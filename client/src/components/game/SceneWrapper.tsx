import { type ReactNode } from "react";
import { Snowflakes } from "./Snowflakes";
import { ProgressIndicator } from "./ProgressIndicator";

interface SceneWrapperProps {
  children: ReactNode;
  showProgress?: boolean;
  showSnow?: boolean;
  className?: string;
  backgroundClass?: string;
}

export function SceneWrapper({
  children,
  showProgress = true,
  showSnow = true,
  className = "",
  backgroundClass = "bg-gradient-to-b from-background via-background to-muted/50",
}: SceneWrapperProps) {
  return (
    <div className={`min-h-screen relative overflow-hidden ${backgroundClass}`}>
      {showSnow && <Snowflakes />}
      {showProgress && <ProgressIndicator />}
      <div className={`relative z-10 ${className}`}>{children}</div>
    </div>
  );
}
