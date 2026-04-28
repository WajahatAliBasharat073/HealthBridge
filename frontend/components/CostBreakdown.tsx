"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wallet, Info, AlertCircle, ShoppingBag } from "lucide-react";
import { CostEstimate } from "@/lib/types";

interface CostBreakdownProps {
  estimate: CostEstimate;
  hospitalName: string;
  language: "en" | "ur";
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ estimate, hospitalName, language }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-[32px] p-8 border border-white/40"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-hb-green/10 text-hb-green flex items-center justify-center">
          <Wallet size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800">
            {language === "en" ? "Cost Estimate" : "اخراجات کا اندازہ"}
          </h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {hospitalName}
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {estimate.cost_breakdown.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0 group">
            <div>
              <p className="font-bold text-slate-700">{item.item}</p>
              <p className="text-xs text-slate-400 font-medium">{item.notes}</p>
            </div>
            <div className="text-right">
              <p className="font-black text-slate-900">
                Rs. {item.range_min_pkr.toLocaleString()} - {item.range_max_pkr.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-hb-blue/5 rounded-[24px] p-6 mb-8 border border-hb-blue/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Most Likely Total</span>
          <span className="text-2xl font-[1000] text-hb-blue">
            Rs. {estimate.most_likely_total_pkr.toLocaleString()}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight flex items-center gap-1">
          <Info size={12} />
          {estimate.most_likely_caveat}
        </p>
      </div>

      {estimate.admission_risk && (
        <div className="flex gap-4 p-5 bg-amber-50/50 backdrop-blur-sm rounded-2xl border border-amber-100 mb-8">
          <AlertCircle className="text-hb-amber shrink-0" size={20} />
          <div>
            <p className="text-sm font-black text-amber-900 mb-1">Potential Admission</p>
            <p className="text-xs text-amber-700 font-medium leading-relaxed">{estimate.admission_cost_note}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ShoppingBag size={14} />
            {language === "en" ? "What to Bring" : "اپنے ساتھ کیا لائیں"}
          </h4>
          <ul className="space-y-2">
            {estimate.what_to_bring.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                <div className="w-1.5 h-1.5 rounded-full bg-hb-blue" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-emerald-50/50 backdrop-blur-sm p-5 rounded-2xl border border-emerald-100 self-start">
          <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mb-2">Money Saving Tip</p>
          <p className="text-sm text-emerald-800 font-bold leading-relaxed">{estimate.cost_saving_tip}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default CostBreakdown;
