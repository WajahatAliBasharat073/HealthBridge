"use client";

import React from "react";
import { Phone, MapPin, Navigation, Clock, ShieldCheck } from "lucide-react";
import { HospitalInfo } from "@/lib/types";

interface HospitalCardProps {
  hospital: HospitalInfo;
  language: "en" | "ur";
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, language }) => {
  const costTierIcons = "₨".repeat(hospital.cost_tier);

  return (
    <div className="min-w-[300px] flex-1 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-hb-blue text-white flex items-center justify-center font-bold text-sm">
            #{hospital.rank}
          </span>
          {hospital.has_er && (
            <span className="px-2 py-1 rounded-md bg-red-50 text-hb-red text-[10px] font-bold border border-red-100 flex items-center gap-1">
              <ShieldCheck size={12} />
              ER
            </span>
          )}
        </div>
        <span className="text-hb-green font-bold text-sm">{costTierIcons}</span>
      </div>

      <h3 className={`text-xl font-bold text-slate-800 mb-2 ${language === "ur" ? "urdu-text" : ""}`}>
        {hospital.name}
      </h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-2 text-slate-500 text-sm">
          <MapPin size={16} className="mt-0.5 shrink-0" />
          <span className={language === "ur" ? "urdu-text" : ""}>{hospital.address}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-xs font-bold">
          <div className="flex items-center gap-1">
            <Navigation size={14} />
            {hospital.distance_km} km
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {hospital.drive_minutes} mins
          </div>
        </div>
      </div>

      <div className="bg-slate-50 rounded-2xl p-4 mb-6">
        <p className={`text-sm text-slate-600 italic ${language === "ur" ? "urdu-text" : ""}`}>
          "{hospital.recommendation_reason}"
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={`tel:${hospital.phone}`}
          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
        >
          <Phone size={16} />
          {language === "en" ? "Call" : "کال کریں"}
        </a>
        <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-hb-blue text-white font-bold text-sm hover:bg-blue-600 transition-all shadow-md shadow-blue-100">
          <Navigation size={16} />
          {language === "en" ? "Directions" : "راستہ"}
        </button>
      </div>
    </div>
  );
};

export default HospitalCard;
