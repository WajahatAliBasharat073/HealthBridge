"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, Home, MessageCircle, Share2, PhoneCall } from "lucide-react";
import { FollowUpOutput } from "@/lib/types";

interface FollowUpStepsProps {
  data: FollowUpOutput;
  language: "en" | "ur";
}

const FollowUpSteps: React.FC<FollowUpStepsProps> = ({ data, language }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'HealthBridge Access Info',
        text: data.share_message,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(data.share_message);
      alert("Message copied to clipboard!");
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { x: -20, opacity: 0 },
    show: { x: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8">
      {/* Reassurance Note */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-8 px-6 bg-blue-50/50 backdrop-blur-sm rounded-[32px] border border-blue-100"
      >
        <p className={`text-xl font-black text-hb-blue italic leading-relaxed ${language === "ur" ? "urdu-text" : ""}`}>
          "{data.reassurance_note}"
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Immediate Actions */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="glass rounded-[32px] p-8 border border-white/40"
        >
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-hb-green" size={22} />
            {language === "en" ? "Immediate Actions" : "فوری اقدامات"}
          </h3>
          <div className="space-y-4">
            {data.immediate_actions.map((action, idx) => (
              <motion.div key={idx} variants={item} className="flex gap-4 group">
                <div className="w-8 h-8 rounded-full bg-hb-green/10 text-hb-green flex items-center justify-center shrink-0 font-bold text-xs">
                  {idx + 1}
                </div>
                <p className={`text-slate-600 font-bold leading-tight ${language === "ur" ? "urdu-text" : ""}`}>
                  {action}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Warning Signs */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="bg-red-50/50 backdrop-blur-md rounded-[32px] p-8 border border-red-100/50 shadow-xl shadow-red-100/20"
        >
          <h3 className="text-lg font-black text-hb-red mb-6 flex items-center gap-2 uppercase tracking-tight">
            <AlertTriangle size={22} />
            {language === "en" ? "Emergency Warning Signs" : "خطرہ کی علامات"}
          </h3>
          <div className="space-y-4">
            {data.warning_signs.map((sign, idx) => (
              <motion.div key={idx} variants={item} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-hb-red mt-2 shrink-0 animate-pulse" />
                <p className={`text-red-900 font-black leading-tight ${language === "ur" ? "urdu-text" : ""}`}>
                  {sign}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* At Hospital Steps */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="glass rounded-[32px] p-8 border border-white/40"
        >
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <PhoneCall className="text-hb-blue" size={22} />
            {language === "en" ? "When You Arrive" : "ہسپتال پہنچ کر"}
          </h3>
          <div className="space-y-4">
            {data.at_hospital_steps.map((step, idx) => (
              <motion.div key={idx} variants={item} className="flex gap-4">
                <div className="w-2 h-8 bg-hb-blue/10 rounded-full shrink-0" />
                <p className={`text-slate-600 font-bold leading-tight ${language === "ur" ? "urdu-text" : ""}`}>
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Home Care */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="glass rounded-[32px] p-8 border border-white/40"
        >
          <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
            <Home className="text-hb-amber" size={22} />
            {language === "en" ? "Wait & Support" : "انتظار اور سہارا"}
          </h3>
          <div className="space-y-4">
            {data.home_care_if_waiting.map((care, idx) => (
              <motion.div key={idx} variants={item} className="flex gap-4">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-hb-amber flex items-center justify-center shrink-0">
                  <CheckCircle2 size={16} />
                </div>
                <p className={`text-slate-600 font-bold leading-tight ${language === "ur" ? "urdu-text" : ""}`}>
                  {care}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Share Section */}
      <div className="flex flex-col items-center gap-6 pt-12">
        <div className="text-center max-w-md">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Coordinate with Family</p>
          <div className="p-6 bg-white/50 backdrop-blur-md rounded-3xl border border-slate-100 shadow-sm mb-6">
            <p className={`text-slate-700 font-medium ${language === "ur" ? "urdu-text" : ""}`}>
              {data.share_message}
            </p>
          </div>
          <button
            onClick={handleShare}
            className="flex items-center gap-3 px-10 py-4 rounded-full bg-green-500 text-white font-black text-sm uppercase tracking-widest hover:bg-green-600 transition-all shadow-xl shadow-green-100"
          >
            <MessageCircle size={20} />
            {language === "en" ? "Share on WhatsApp" : "واٹس ایپ پر شیئر کریں"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpSteps;
