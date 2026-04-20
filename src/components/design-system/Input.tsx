import React from "react";
import { LucideIcon } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon: Icon,
  error,
  containerClassName = "",
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-brand-primary transition-colors" />
        )}
        <input
          className={`w-full bg-white border border-border-subtle rounded-xl py-3 ${
            Icon ? "pl-12" : "px-4"
          } pr-4 text-sm text-text-primary placeholder:text-slate-400 focus:outline-none focus:border-brand-primary/50 transition-all duration-200 dark:bg-bg-card dark:border-border-subtle dark:placeholder:text-slate-500 dark:focus:bg-bg-card-hover dark:focus:border-brand-primary/30 ${
            error ? "border-red-500/50 focus:border-red-500" : ""
          } ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest pl-1">
          {error}
        </p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: LucideIcon;
  options: { value: string; label: string }[];
  containerClassName?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  icon: Icon,
  options,
  containerClassName = "",
  className = "",
  ...props
}) => {
  return (
    <div className={`space-y-2 ${containerClassName}`}>
      {label && (
        <label className="text-xs font-bold text-text-secondary uppercase tracking-widest pl-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary group-focus-within:text-brand-primary transition-colors z-10 pointer-events-none" />
        )}
        <select
          className={`w-full bg-white border border-border-subtle rounded-xl py-3 ${
            Icon ? "pl-12" : "px-4"
          } pr-10 text-sm text-text-primary appearance-none focus:outline-none focus:border-brand-primary/50 transition-all duration-200 cursor-pointer dark:bg-bg-card dark:border-border-subtle dark:focus:bg-bg-card-hover dark:focus:border-brand-primary/30 ${className}`}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary group-focus-within:text-brand-primary transition-colors">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>
    </div>
  );
};
