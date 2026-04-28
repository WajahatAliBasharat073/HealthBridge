"use client";

import React from "react";
import { AlertCircle, CheckCircle, Clock, ShieldAlert } from "lucide-react";

interface UrgencyBadgeProps {
  level: number;
  label: string;
  explanation: string;
  language: "en" | "ur";
}

const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ level, label, explanation, language }) => {
  const configs: Record<number, { bg: string; text: string; icon: any; border: string }> = {
    1: { bg: "bg-green-50", text: "text-hb-green", icon: CheckCircle, border: "border-green-100" },
    2: { bg: "bg-yellow-50", text: "text-hb-amber", icon: Clock, border: "border-yellow-100" },
    3: { bg: "bg-orange-50", text: "text-orange-500", icon: AlertCircle, border: "border-orange-100" },
    4: { bg: "bg-red-50", text: "text-hb-red", icon: ShieldAlert, border: "border-red-100" },
    5: { bg: "bg-red-600", text: "text-white", icon: ShieldAlert, border: "border-red-700" },
  };

  const config = configs[level] || configs[1];
  const Icon = config.icon;

  return (
    <div className={`w-full p-6 rounded-3xl border-2 ${config.bg} ${config.border} ${level === 5 ? "animate-pulse" : ""}`}>
      <div className="flex items-center gap-4 mb-3">
        <div className={`p-3 rounded-2xl ${level === 5 ? "bg-white/20" : "bg-white shadow-sm"}`}>
          <Icon size={28} className={level === 5 ? "text-white" : config.text} />
        </div>
        <div>
          <p className={`text-xs font-bold uppercase tracking-wider opacity-60 ${config.text}`}>
            {language === "en" ? "Urgency Assessment" : "فوری ضرورت کا اندازہ"}
          </p>
          <h2 className={`text-2xl font-black ${config.text} ${language === "ur" ? "urdu-text" : ""}`}>
            {label}
          </h2>
        </div>
      </div>
      <p className={`text-lg font-medium ${level === 5 ? "text-white" : "text-slate-600"} ${language === "ur" ? "urdu-text text-right" : "text-left"}`}>
        {explanation}
      </p>
    </div>
  );
};

export default UrgencyBadge;
