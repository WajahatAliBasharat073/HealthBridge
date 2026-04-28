"use client";

import React from "react";
import { motion } from "framer-motion";
import { Phone, MapPin, Navigation, Clock, ShieldCheck, Heart } from "lucide-react";
import { HospitalInfo } from "@/lib/types";

interface HospitalCardProps {
  hospital: HospitalInfo;
  language: "en" | "ur";
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, language }) => {
  const costTierIcons = "₨".repeat(hospital.cost_tier);

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="min-w-[300px] glass rounded-[32px] p-6 relative overflow-hidden group border border-white/40 flex-shrink-0"
    >
      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
        <Heart size={80} className="text-hb-blue" />
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-hb-blue text-white flex items-center justify-center font-black text-sm shadow-lg shadow-blue-200">
            #{hospital.rank}
          </span>
          {hospital.has_er && (
            <span className="px-3 py-1 rounded-lg bg-red-50 text-hb-red text-[10px] font-black border border-red-100 flex items-center gap-1 uppercase tracking-wider">
              <ShieldCheck size={12} />
              ER Ready
            </span>
          )}
        </div>
        <span className="text-hb-green font-black text-sm tracking-widest">{costTierIcons}</span>
      </div>

      <h3 className={`text-xl font-black text-slate-800 mb-3 leading-tight ${language === "ur" ? "urdu-text" : ""}`}>
        {hospital.name}
      </h3>
      
      <div className="space-y-3 mb-8">
        <div className="flex items-start gap-2 text-slate-500 text-sm font-medium">
          <MapPin size={16} className="mt-0.5 shrink-0 text-slate-300" />
          <span className={language === "ur" ? "urdu-text" : ""}>{hospital.address}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-[10px] font-black uppercase tracking-widest">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
            <Navigation size={12} className="text-hb-blue" />
            {hospital.distance_km} km
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
            <Clock size={12} className="text-hb-blue" />
            {hospital.drive_minutes} mins
          </div>
        </div>
      </div>

      <div className="bg-slate-50/50 backdrop-blur-sm rounded-2xl p-4 mb-8 border border-white/50">
        <p className={`text-sm text-slate-600 font-medium italic ${language === "ur" ? "urdu-text" : ""}`}>
          "{hospital.recommendation_reason}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`tel:${hospital.phone}`}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/50 text-slate-700 font-black text-xs uppercase tracking-widest hover:bg-white transition-all border border-slate-100"
        >
          <Phone size={14} />
          {language === "en" ? "Call" : "کال کریں"}
        </a>
        <button className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-hb-blue text-white font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-100">
          <Navigation size={14} />
          {language === "en" ? "Go" : "راستہ"}
        </button>
      </div>
    </motion.div>
  );
};

export default HospitalCard;
