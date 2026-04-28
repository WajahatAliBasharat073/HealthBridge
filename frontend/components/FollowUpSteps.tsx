"use client";

import React from "react";
import { ListChecks, AlertCircle, Home, ShieldCheck } from "lucide-react";
import { FollowUpInfo } from "@/lib/types";

interface FollowUpStepsProps {
  data: FollowUpInfo;
  language: "en" | "ur";
}

const FollowUpSteps: React.FC<FollowUpStepsProps> = ({ data, language }) => {
  const sections = [
    { title: language === "en" ? "Right Now" : "فوری قدم", items: data.immediate_actions, icon: AlertCircle, color: "text-hb-red", bg: "bg-red-50" },
    { title: language === "en" ? "At Hospital" : "ہسپتال پہنچ کر", items: data.at_hospital_steps, icon: ShieldCheck, color: "text-hb-blue", bg: "bg-blue-50" },
    { title: language === "en" ? "Warning Signs" : "خطرہ کی علامات", items: data.warning_signs, icon: AlertCircle, color: "text-hb-amber", bg: "bg-amber-50" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 rounded-2xl bg-slate-100 text-slate-600">
          <ListChecks size={24} />
        </div>
        <h3 className="text-2xl font-bold text-slate-800">
          {language === "en" ? "Next Steps & Care Guide" : "اگلے قدم اور نگہداشت کی گائیڈ"}
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <div className={`flex items-center gap-2 p-3 rounded-xl ${section.bg} ${section.color}`}>
              <section.icon size={18} />
              <span className="font-bold text-sm uppercase tracking-wider">{section.title}</span>
            </div>
            <ul className="space-y-3 px-1">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm text-slate-600 leading-relaxed">
                  <span className="font-bold text-slate-300">{i + 1}.</span>
                  <span className={language === "ur" ? "urdu-text text-right w-full" : "text-left"}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <p className={`text-slate-400 italic text-sm max-w-lg ${language === "ur" ? "urdu-text" : ""}`}>
          "{data.reassurance_note}"
        </p>
        
        <a 
          href={`https://wa.me/?text=${encodeURIComponent(data.share_message)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold transition-all shadow-lg shadow-green-100"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.001.332.005c.109.004.258-.041.404.311.145.355.492 1.2.535 1.287.044.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.101-.177.211-.077.383.1.173.444.731.953 1.185.656.584 1.21.765 1.382.852.173.087.275.072.376-.043.101-.115.433-.505.548-.678.115-.173.231-.144.39-.087s1.011.477 1.184.563c.173.087.289.13.332.202.045.072.045.419-.1.824z"/>
          </svg>
          <span>{language === "en" ? "Share with Family" : "خاندان کو بھیجیں"}</span>
        </a>
      </div>
    </div>
  );
};

export default FollowUpSteps;
