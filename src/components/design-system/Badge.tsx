import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "success" | "danger" | "warning";
  size?: "xs" | "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "sm",
  className = "",
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-widest rounded-full border";
  
  const variants = {
    primary: "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
    secondary: "bg-slate-500/10 text-slate-500 border-slate-500/20 dark:text-text-secondary",
    outline: "bg-transparent border-slate-200 text-slate-500 dark:border-white/10 dark:text-text-secondary",
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    danger: "bg-red-500/10 text-red-500 border-red-500/20",
    warning: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };

  const sizes = {
    xs: "px-2 py-0.5 text-[8px]",
    sm: "px-3 py-1 text-[10px]",
    md: "px-4 py-1.5 text-xs",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};
