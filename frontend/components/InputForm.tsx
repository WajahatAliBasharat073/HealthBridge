"use client";

import React, { useState } from "react";
import { Mic, Search, MapPin, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InputFormProps {
  onSubmit: (data: { text: string; age_group: string; demo_mode: boolean }) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<"en" | "ur">("en");
  const [ageGroup, setAgeGroup] = useState("adult");
  const [demoMode, setDemoMode] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const ageGroups = [
    { id: "infant", en: "Infant", ur: "شیر خوار" },
    { id: "child", en: "Child", ur: "بچہ" },
    { id: "adult", en: "Adult", ur: "بالغ" },
    { id: "elderly", en: "Elderly", ur: "بزرگ" },
  ];

  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = language === "en" ? "en-US" : "ur-PK";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    recognition.start();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-slate-100"
    >
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage("en")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              language === "en" ? "bg-hb-blue text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage("ur")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all urdu-text ${
              language === "ur" ? "bg-hb-blue text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            اردو
          </button>
        </div>
        <div className="flex items-center text-slate-400 text-xs gap-1">
          <MapPin size={14} />
          <span>📍 Using Lahore</span>
        </div>
      </div>

      <div className="relative group mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            language === "en"
              ? "Describe symptoms (e.g. child has high fever since yesterday)"
              : "علامات بتائیں (مثلاً بچے کو کل سے تیز بخار ہے)"
          }
          className={`w-full min-h-[160px] p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-hb-blue outline-none transition-all resize-none text-lg ${
            language === "ur" ? "text-right urdu-text" : "text-left"
          }`}
        />
        <button
          onClick={handleMicClick}
          className={`absolute bottom-4 right-4 p-3 rounded-full transition-all ${
            isListening ? "bg-hb-red text-white animate-pulse" : "bg-white text-slate-400 hover:text-hb-blue shadow-md"
          }`}
        >
          <Mic size={24} />
        </button>
      </div>

      <div className="mb-8">
        <p className={`text-slate-500 text-sm mb-3 font-medium ${language === "ur" ? "text-right" : "text-left"}`}>
          {language === "en" ? "Who is this for?" : "یہ کس کے لیے ہے؟"}
        </p>
        <div className="grid grid-cols-4 gap-3">
          {ageGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => setAgeGroup(group.id)}
              className={`py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                ageGroup === group.id
                  ? "border-hb-blue bg-blue-50 text-hb-blue"
                  : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
              }`}
            >
              {language === "en" ? group.en : group.ur}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onSubmit({ text, age_group: ageGroup, demo_mode: demoMode })}
        disabled={isLoading || !text.trim()}
        className="w-full bg-hb-blue hover:bg-blue-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Heart size={20} className="fill-current" />
            <span>{language === "en" ? "Find Help Now" : "فوری مدد حاصل کریں"}</span>
          </>
        )}
      </button>

      {/* Hidden Dev Demo Toggle */}
      <div className="absolute bottom-4 right-4 opacity-10 hover:opacity-100 transition-opacity">
        <label className="flex items-center gap-2 text-[10px] text-slate-400 cursor-pointer">
          <input 
            type="checkbox" 
            checked={demoMode} 
            onChange={(e) => setDemoMode(e.target.checked)}
            className="w-3 h-3"
          />
          Demo Mode
        </label>
      </div>
    </motion.div>
  );
};

export default InputForm;
