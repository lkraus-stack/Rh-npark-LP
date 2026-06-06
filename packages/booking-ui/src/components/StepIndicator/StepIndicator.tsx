import { type CSSProperties } from "react";

export interface StepIndicatorProps {
  current: number;
  total: number;
  labels?: string[];
}

export function StepIndicator({ current, total, labels = [] }: StepIndicatorProps) {
  const steps = Array.from({ length: total }, (_, index) => index + 1);
  const style = { "--bk-step-total": total } as CSSProperties;

  return (
    <div className="step-indicator" aria-label={`Schritt ${current} von ${total}`} style={style}>
      {steps.map((step) => {
        const state = step < current ? "complete" : step === current ? "current" : "upcoming";
        const label = labels[step - 1] ? `: ${labels[step - 1]}` : "";

        return (
          <span className={step <= current ? `active ${state}` : state} key={step} aria-label={`Schritt ${step}${label}`}>
            {step}
          </span>
        );
      })}
    </div>
  );
}
