"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const steps = [
  { id: "triage", en: "Triage", ur: "ترجیح" },
  { id: "hospital", en: "Hospitals", ur: "ہسپتال" },
  { id: "cost", en: "Cost", ur: "اخراجات" },
  { id: "followup", en: "Follow-up", ur: "اگلے قدم" },
];

const PipelineProgress = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const intervals = [500, 2000, 3500, 5000];
    const timers = intervals.map((delay, index) => 
      setTimeout(() => setCurrentStep(index + 1), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto py-12 px-6">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-10" />
        
        {steps.map((step, index) => {
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted ? "#22C55E" : isActive ? "#0EA5E9" : "#F1F5F9",
                  scale: isActive ? 1.2 : 1,
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                  isCompleted || isActive ? "text-white" : "text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <Check size={20} strokeWidth={3} />
                ) : isActive ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  index + 1
                )}
              </motion.div>
              
              <div className="mt-4 flex flex-col items-center gap-0.5">
                <span className={`text-xs font-bold ${isActive ? "text-hb-blue" : "text-slate-400"}`}>
                  {step.en}
                </span>
                <span className={`text-[10px] font-medium urdu-text ${isActive ? "text-hb-blue" : "text-slate-400"}`}>
                  {step.ur}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-10 text-slate-400 text-sm font-medium italic"
      >
        {currentStep === 0 && "Analyzing your symptoms..."}
        {currentStep === 1 && "Finding the best hospitals near you..."}
        {currentStep === 2 && "Calculating realistic costs..."}
        {currentStep === 3 && "Preparing your care guide..."}
        {currentStep >= 4 && "Finalizing results..."}
      </motion.p>
    </div>
  );
};

export default PipelineProgress;
