"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, ShieldCheck, Siren, Info } from "lucide-react";

interface UrgencyBadgeProps {
  level: number;
  label: string;
  explanation: string;
  language: "en" | "ur";
}

const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level, label, explanation, language }) => {
  const getStyles = () => {
    switch (level) {
      case 5:
        return { 
          bg: "bg-red-500", 
          text: "text-white", 
          glow: "shadow-red-500/50",
          icon: <Siren size={32} className="animate-pulse" />,
          pulse: true 
        };
      case 4:
        return { 
          bg: "bg-red-50", 
          text: "text-hb-red", 
          glow: "shadow-red-200",
          icon: <AlertTriangle size={32} />,
          pulse: false 
        };
      case 3:
        return { 
          bg: "bg-amber-50", 
          text: "text-hb-amber", 
          glow: "shadow-amber-200",
          icon: <Clock size={32} />,
          pulse: false 
        };
      case 2:
        return { 
          bg: "bg-blue-50", 
          text: "text-hb-blue", 
          glow: "shadow-blue-200",
          icon: <Info size={32} />,
          pulse: false 
        };
      default:
        return { 
          bg: "bg-green-50", 
          text: "text-hb-green", 
          glow: "shadow-green-200",
          icon: <ShieldCheck size={32} />,
          pulse: false 
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`glass rounded-[40px] p-8 border border-white/40 shadow-2xl ${styles.glow} relative overflow-hidden`}
    >
      {/* Animated Pulse Background for Emergency */}
      {styles.pulse && (
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-red-500"
        />
      )}

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className={`w-20 h-20 rounded-[28px] ${styles.bg} ${styles.text} flex items-center justify-center shadow-xl`}>
          {styles.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Urgency Level {level}</span>
            <div className="h-px w-8 bg-slate-200" />
          </div>
          <h2 className={`text-4xl font-[1000] mb-3 tracking-tight ${level >= 4 ? 'text-red-600' : 'text-slate-800'}`}>
            {label}
          </h2>
          <p className={`text-lg font-bold text-slate-500 leading-relaxed ${language === "ur" ? "urdu-text" : ""}`}>
            {explanation}
          </p>
        </div>

        <div className="hidden lg:block border-l border-slate-100 pl-8 h-20 flex items-center">
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
            <p className={`text-sm font-black uppercase ${styles.pulse ? 'text-red-600 animate-pulse' : 'text-slate-600'}`}>
              {styles.pulse ? 'Critical' : 'Stable'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default UrgencyBadge;
