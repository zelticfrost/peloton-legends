import { motion } from "motion/react";
import { Card as CardType, Specialty } from "../types";
import { Mountain, Wind, Timer, Zap, Trophy } from "lucide-react";
import { getFlagUrl } from "../lib/flags";

interface CardProps {
  card: CardType;
  onClick?: () => void;
  quantity?: number;
}

const SPECIALTY_ICONS: Record<Specialty, any> = {
  [Specialty.MOUNTAINS]: Mountain,
  [Specialty.FLAT]: Wind,
  [Specialty.CHRONO]: Timer,
  [Specialty.CLASSICS]: Zap,
  [Specialty.COBBLES]: Trophy,
};

const RARITY_STYLES: Record<CardType["rarity"], { container: string; accent: string; badge: string }> = {
  COMMON: { 
    container: "border-slate-700 bg-[#1a1d23] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]", 
    accent: "text-slate-400",
    badge: "bg-slate-800 text-slate-400"
  },
  UNCOMMON: { 
    container: "border-emerald-500/40 bg-[#1a1d23] shadow-[0_0_25px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)]", 
    accent: "text-emerald-400",
    badge: "bg-emerald-600 text-white border-emerald-500/30"
  },
  RARE: { 
    container: "border-blue-500/40 bg-[#1a1d23] shadow-[0_0_35px_rgba(59,130,246,0.25)] hover:shadow-[0_0_50px_rgba(59,130,246,0.4)]", 
    accent: "text-blue-400",
    badge: "bg-blue-600 text-white border-blue-500/30"
  },
  LEGENDARY: { 
    container: "border-transparent bg-[#0f1115] shadow-[0_0_50px_rgba(245,158,11,0.3)] hover:shadow-[0_0_70px_rgba(245,158,11,0.5)]", 
    accent: "text-amber-500",
    badge: "bg-amber-500 text-black border-amber-400/50"
  },
};

export function Card({ card, onClick, quantity }: CardProps) {
  const SpecialtyIcon = SPECIALTY_ICONS[card.specialty];
  const isLegendary = card.rarity === "LEGENDARY";
  const style = RARITY_STYLES[card.rarity];

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative w-72 h-[480px] rounded-2xl border-2 ${
        style.container
      } overflow-hidden cursor-pointer flex flex-col group`}
    >
      {/* Background Patterns for Rarities */}
      {!isLegendary && (
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
          {card.rarity === "RARE" && (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_var(--tw-gradient-from)_0%,_transparent_50%)] from-blue-500" />
          )}
          {card.rarity === "UNCOMMON" && (
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,_transparent,_transparent_10px,_rgba(16,185,129,0.5)_10px,_rgba(16,185,129,0.5)_11px)]" />
          )}
        </div>
      )}

      {/* Legendary Animated Border */}
      {isLegendary && (
        <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[conic-gradient(from_0deg,#f59e0b_0deg,transparent_60deg,transparent_120deg,#f59e0b_180deg,transparent_240deg,transparent_300deg,#f59e0b_360deg)]"
          />
        </div>
      )}

      {/* Internal Border for Legendary */}
      {isLegendary && (
        <div className="absolute inset-[1px] rounded-[14px] bg-[#0f1115] z-[1] pointer-events-none" />
      )}

      {/* Holographic Shine Effect */}
      {(isLegendary || card.rarity === "RARE") && (
        <motion.div 
          animate={{ 
            x: ["-100%", "200%"],
            opacity: [0, isLegendary ? 0.5 : 0.2, 0]
          }}
          transition={{ 
            duration: isLegendary ? 3 : 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            repeatDelay: isLegendary ? 1 : 3
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 z-30 pointer-events-none"
        />
      )}

      {/* Quantity Badge */}
      {quantity !== undefined && quantity > 1 && (
        <div className={`absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full font-bold text-xs z-40 shadow-lg border border-black/10 ${
          isLegendary ? "bg-amber-500 text-black" : "bg-slate-700 text-white"
        }`}>
          x{quantity}
        </div>
      )}

      {/* Nationality Badge */}
      <div className="absolute top-3 left-3 bg-slate-900/60 dark:bg-black/60 backdrop-blur-md p-1 rounded-md border border-border-subtle z-40 flex items-center justify-center overflow-hidden">
        {getFlagUrl(card.nationality) ? (
          <img 
            src={getFlagUrl(card.nationality)!} 
            alt={card.nationality} 
            className="w-5 h-3.5 object-cover rounded-sm"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span className="text-[10px] font-bold text-white uppercase tracking-wider px-1">
            {card.nationality.slice(0, 3)}
          </span>
        )}
      </div>

      {/* Specialty Icon */}
      <div className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border z-40 backdrop-blur-md ${
        isLegendary ? "bg-brand-primary/20 border-brand-primary/50" : "bg-slate-100/50 border-slate-200 dark:bg-white/10 dark:border-white/20"
      }`}>
        <SpecialtyIcon className={`w-4 h-4 ${isLegendary ? "text-brand-primary" : "text-slate-600 dark:text-white"}`} />
      </div>

      {/* Rider Image Container */}
      <div className={`relative h-3/5 overflow-hidden z-10 ${isLegendary ? 'mx-[2px] mt-[2px] rounded-t-[14px]' : 'w-full'}`}>
        {/* Rarity Aura */}
        {(isLegendary || card.rarity === "RARE" || card.rarity === "UNCOMMON") && (
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] pointer-events-none ${
              isLegendary ? "from-amber-500/20" : 
              card.rarity === "RARE" ? "from-blue-500/15" : "from-emerald-500/10"
            }`}
          />
        )}
        <img
          src={card.imageUrl}
          alt={card.name}
          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
          referrerPolicy="no-referrer"
        />
        <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent z-20 ${
          isLegendary ? "from-[#0f1115]" : "from-[#1a1d23]"
        }`} />
      </div>

      {/* Card Info */}
      <div className={`flex-1 p-5 flex flex-col z-20 -mt-12 ${isLegendary ? 'mx-[2px] mb-[2px] rounded-b-[14px]' : ''}`}>
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono uppercase tracking-[0.2em] font-bold ${style.accent}`}>
              {card.type}
            </span>
            {card.rarity !== "COMMON" && (
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded flex items-center gap-1 uppercase border ${style.badge}`}>
                {isLegendary && <Trophy className="w-2 h-2" />} {card.rarity}
              </span>
            )}
          </div>
          <h3 className={`font-bold text-2xl tracking-tight leading-tight mt-1 ${
            isLegendary ? "text-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" : "text-white"
          }`}>
            {card.name}
          </h3>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide mt-1">
            {card.team}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <StatItem label="Climbing" value={card.stats.climbing} color={style.accent} />
          <StatItem label="Sprinting" value={card.stats.sprinting} color={style.accent} />
          <StatItem label="Stamina" value={card.stats.stamina} color={style.accent} />
          <StatItem label="Technique" value={card.stats.technique} color={style.accent} />
        </div>

        <div className="mt-4 pt-4 border-t border-border-subtle flex justify-between items-center">
          <span className="text-[10px] font-mono text-slate-500">#{card.id.padStart(3, '0')}</span>
          <span className={`text-[10px] font-mono ${isLegendary ? "text-brand-primary/50" : "text-slate-500"}`}>
            {card.year} EDITION
          </span>
        </div>
      </div>

      {/* Legendary Sparkles/Particles */}
      {isLegendary && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [-20, 480],
                x: [Math.random() * 280, Math.random() * 280],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 2 + 2,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute w-1 h-1 bg-amber-400 rounded-full blur-[1px]"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}



function StatItem({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center px-1">
        <span className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">{label}</span>
        <span className={`text-xs font-bold ${color}`}>{value}</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full bg-current ${color}`}
        />
      </div>
    </div>
  );
}

