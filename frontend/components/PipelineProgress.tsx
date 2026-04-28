"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, MapPin, Wallet, ClipboardCheck } from "lucide-react";

const steps = [
  { id: "triage", label: "Triage Assessment", icon: <ShieldCheck size={24} />, color: "text-hb-blue", bg: "bg-blue-50" },
  { id: "matching", label: "Hospital Matching", icon: <MapPin size={24} />, color: "text-hb-green", bg: "bg-green-50" },
  { id: "cost", label: "Cost Estimation", icon: <Wallet size={24} />, color: "text-hb-amber", bg: "bg-amber-50" },
  { id: "followup", label: "Care Instructions", icon: <ClipboardCheck size={24} />, color: "text-hb-red", bg: "bg-red-50" },
];

const PipelineProgress: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-20 px-6">
      <div className="text-center mb-16">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block w-3 h-3 bg-hb-blue rounded-full mb-4"
        />
        <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Processing Symptoms</h2>
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">AI Multi-Agent Pipeline Active</p>
      </div>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            className="h-full bg-hb-blue shadow-[0_0_15px_rgba(14,165,233,0.5)]"
          />
        </div>

        {/* Steps */}
        <div className="flex justify-between items-center relative z-10">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center group">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: currentStep === idx ? 1.2 : 1,
                  opacity: 1,
                  backgroundColor: currentStep >= idx ? "#fff" : "#f8fafc"
                }}
                className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all duration-500 border-2 ${
                  currentStep === idx 
                    ? "border-hb-blue shadow-blue-200" 
                    : currentStep > idx 
                      ? "border-hb-green shadow-green-100" 
                      : "border-slate-100 shadow-transparent"
                }`}
              >
                <div className={`${currentStep >= idx ? step.color : "text-slate-300"}`}>
                  {step.icon}
                </div>
                
                {currentStep === idx && (
                  <motion.div
                    layoutId="active-ring"
                    className="absolute inset-0 rounded-[24px] border-2 border-hb-blue animate-ping opacity-20"
                  />
                )}
              </motion.div>
              
              <div className="absolute top-20 text-center w-32">
                <p className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${
                  currentStep === idx ? "text-slate-800" : "text-slate-300"
                }`}>
                  {step.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-40 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-slate-500 font-bold italic"
          >
            {currentStep === 0 && "Analyzing symptom patterns..."}
            {currentStep === 1 && "Looking for nearby verified facilities..."}
            {currentStep === 2 && "Calculating realistic cost ranges..."}
            {currentStep === 3 && "Finalizing compassionate care guide..."}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PipelineProgress;
