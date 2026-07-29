import { Check } from "lucide-react";
import { strings } from "../../data/strings";

interface ProgressBarProps {
  currentStep: number; // 1-4
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const labels = strings.booking.stepLabels;

  return (
    <ol className="flex items-center justify-between" aria-label="Booking progress">
      {labels.map((label, index) => {
        const stepNumber = index + 1;
        const isComplete = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                aria-current={isCurrent ? "step" : undefined}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 font-display text-sm font-semibold transition-colors ${
                  isComplete
                    ? "border-brand-gold bg-brand-gold text-brand-navy"
                    : isCurrent
                      ? "border-brand-gold text-brand-gold"
                      : "border-brand-gray-300 text-brand-gray-400"
                }`}
              >
                {isComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : stepNumber}
              </div>
              <span
                className={`hidden text-xs font-medium sm:block ${
                  isCurrent ? "text-brand-navy" : "text-brand-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {stepNumber !== labels.length && (
              <div className={`mx-2 h-0.5 flex-1 ${isComplete ? "bg-brand-gold" : "bg-brand-gray-200"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
