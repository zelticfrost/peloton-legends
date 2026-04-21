import type { LucideIcon } from "lucide-react";

type NavItemProps = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  badge?: number;
};

export function NavItem({ icon: Icon, label, active = false, onClick, badge }: NavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left group ${
        active
          ? "bg-brand-primary text-black font-bold shadow-lg shadow-brand-primary/20"
          : "text-text-secondary hover:text-text-primary hover:bg-slate-100 dark:hover:bg-white/5"
      }`}
    >
      <Icon
        className={`w-5 h-5 ${active ? "text-black" : "text-text-secondary group-hover:text-brand-primary"} transition-colors`}
      />
      <span className="text-sm">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
            active ? "bg-black text-brand-primary" : "bg-brand-primary text-black shadow-lg shadow-brand-primary/40"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
