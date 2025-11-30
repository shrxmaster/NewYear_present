import { type ReactNode } from "react";

interface DialogueBoxProps {
  speaker?: string;
  children: ReactNode;
  className?: string;
}

export function DialogueBox({ speaker, children, className = "" }: DialogueBoxProps) {
  return (
    <div
      className={`
        relative max-w-prose mx-auto
        bg-card/95 dark:bg-card/90 backdrop-blur-sm
        rounded-3xl border border-border/50
        shadow-lg p-6 md:p-8
        animate-fade-in-up
        ${className}
      `}
      data-testid="dialogue-box"
    >
      {speaker && (
        <div className="absolute -top-3 left-6">
          <span
            className="
              inline-block px-4 py-1.5
              bg-primary text-primary-foreground
              rounded-full text-sm font-medium font-display
              shadow-md
            "
            data-testid={`speaker-${speaker.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {speaker}
          </span>
        </div>
      )}
      <div
        className="font-story text-lg leading-relaxed text-foreground/90 dark:text-foreground/95"
        data-testid="dialogue-content"
      >
        {children}
      </div>
    </div>
  );
}
