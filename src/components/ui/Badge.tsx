import * as React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold font-mono tracking-wider transition-colors";

    const variants: Record<string, string> = {
      default: "bg-accent-500/15 text-accent-400 border border-accent-500/20",
      secondary:
        "bg-dark-700/60 text-dark-300 border border-dark-600/40",
      destructive:
        "bg-neon-red/15 text-neon-red border border-neon-red/20",
      outline: "bg-transparent text-dark-300 border border-dark-600/50",
    };

    return (
      <span
        ref={ref}
        className={cn(base, variants[variant], className)}
        {...props}
      />
    );
  },
);
Badge.displayName = "Badge";

export { Badge };
