"use client";

import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Map as MapIcon, Share2 } from "lucide-react";
import { HealthBridgeResponse } from "@/lib/types";
import UrgencyBadge from "./UrgencyBadge";
import HospitalCard from "./HospitalCard";
import CostBreakdown from "./CostBreakdown";
import FollowUpSteps from "./FollowUpSteps";
import MapView from "./MapView";

interface ResponseCardProps {
  data: HealthBridgeResponse;
  onReset: () => void;
}

const ResponseCard: React.FC<ResponseCardProps> = ({ data, onReset }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-8 pb-20"
    >
      {/* Urgency Section */}
      <UrgencyBadge 
        level={data.urgency_level}
        label={data.urgency_label}
        explanation={data.patient_explanation}
        language={data.language}
      />

      {/* Hospital Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MapIcon size={20} className="text-hb-blue" />
            {data.language === "en" ? "Recommended Hospitals" : "تجویز کردہ ہسپتال"}
          </h3>
          <span className="text-xs font-medium text-slate-400">
            {data.language === "en" ? "Based on proximity & urgency" : "قربت اور ضرورت کی بنیاد پر"}
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
          {data.recommended_hospitals.map((hospital) => (
            <HospitalCard 
              key={hospital.id} 
              hospital={hospital} 
              language={data.language} 
            />
          ))}
        </div>
      </div>

      {/* Map Section */}
      <MapView 
        hospitals={data.recommended_hospitals}
        userLocation={[31.5497, 74.3436]} // Default Lahore
      />

      {/* Cost Section (if available) */}
      {data.cost_estimate && (
        <CostBreakdown 
          estimate={data.cost_estimate}
          hospitalName={data.recommended_hospitals[0]?.name || "Hospital"}
          language={data.language}
        />
      )}

      {/* Follow-up Section */}
      <FollowUpSteps 
        data={data.follow_up}
        language={data.language}
      />

      {/* Reset Button */}
      <div className="flex justify-center pt-8">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-3 rounded-full bg-slate-100 text-slate-500 font-bold hover:bg-slate-200 transition-all"
        >
          <RefreshCw size={18} />
          {data.language === "en" ? "Start Over" : "دوبارہ شروع کریں"}
        </button>
      </div>

      {data.error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 text-xs text-center">
          ⚠️ {data.error}. Some data might be simulated.
        </div>
      )}
    </motion.div>
  );
};

export default ResponseCard;
