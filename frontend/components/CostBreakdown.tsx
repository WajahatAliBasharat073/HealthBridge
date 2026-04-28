"use client";

import React from "react";
import { Wallet, Info, CheckCircle2, AlertTriangle } from "lucide-react";
import { CostEstimate } from "@/lib/types";

interface CostBreakdownProps {
  estimate: CostEstimate;
  hospitalName: string;
  language: "en" | "ur";
}

const CostBreakdown: React.FC<CostBreakdownProps> = ({ estimate, hospitalName, language }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-hb-green/10 text-hb-green">
          <Wallet size={24} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800">
          {language === "en" ? `Estimated Cost at ${hospitalName}` : `${hospitalName} پر متوقع اخراجات`}
        </h3>
      </div>

      <div className="space-y-4 mb-10">
        {estimate.cost_breakdown.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <p className={`font-bold text-slate-700 ${language === "ur" ? "urdu-text" : ""}`}>{item.item}</p>
              <p className="text-xs text-slate-400">{item.notes}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-hb-blue">PKR {item.range_min_pkr.toLocaleString()} - {item.range_max_pkr.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-32 h-32 bg-hb-blue/20 rounded-full blur-3xl -mr-16 -mt-16" />
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Most Likely Total</p>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-4xl font-black text-hb-green">PKR {estimate.most_likely_total_pkr.toLocaleString()}</span>
          <span className="text-slate-500 line-through text-sm">Range: {estimate.total_range_min_pkr.toLocaleString()} - {estimate.total_range_max_pkr.toLocaleString()}</span>
        </div>
        <p className="text-slate-300 text-sm italic">"{estimate.most_likely_caveat}"</p>
      </div>

      {estimate.admission_risk && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-3 items-start mb-8">
          <AlertTriangle className="text-hb-red shrink-0" size={20} />
          <div>
            <p className="text-hb-red font-bold text-sm">Admission Possible</p>
            <p className="text-red-700 text-xs">{estimate.admission_cost_note}</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-hb-blue" />
            {language === "en" ? "What to Bring" : "اپنے ساتھ کیا لائیں"}
          </h4>
          <ul className="space-y-2">
            {estimate.what_to_bring.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2 text-slate-600 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-hb-green/5 rounded-2xl p-6 border border-hb-green/10">
          <h4 className="font-bold text-hb-green mb-2 flex items-center gap-2">
            <Info size={18} />
            {language === "en" ? "Cost Saving Tip" : "بچت کے لیے مشورہ"}
          </h4>
          <p className="text-hb-green text-sm font-medium leading-relaxed italic">
            "{estimate.cost_saving_tip}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default CostBreakdown;
