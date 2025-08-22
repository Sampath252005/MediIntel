import { Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-lg font-semibold text-primary",
        className
      )}
    >
      <Stethoscope className="h-7 w-7" />
      <span className="text-xl font-bold text-foreground">MediMind AI</span>
    </div>
  );
}
