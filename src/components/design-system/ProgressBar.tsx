import React from "react";
import { motion } from "motion/react";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  subLabel?: string;
  variant?: "primary" | "secondary" | "success" | "danger";
  size?: "xs" | "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  subLabel,
  variant = "primary",
  size = "sm",
  showValue = true,
  className = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    primary: "bg-brand-primary",
    secondary: "bg-slate-500",
    success: "bg-emerald-500",
    danger: "bg-red-500",
  };

  const sizes = {
    xs: "h-1",
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || subLabel || showValue) && (
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
          <div className="flex items-center gap-2">
            {label && <span className="text-text-secondary">{label}</span>}
            {subLabel && <span className="text-slate-400 dark:text-slate-400 italic font-normal lowercase">{subLabel}</span>}
          </div>
          {showValue && <span className="text-text-primary font-mono">{value} / {max}</span>}
        </div>
      )}
      
      <div className={`w-full ${sizes[size]} bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${variants[variant]} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
        />
      </div>
    </div>
  );
};
