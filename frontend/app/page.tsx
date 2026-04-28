"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Activity, Users, ShieldCheck } from "lucide-react";
import InputForm from "@/components/InputForm";
import ResponseCard from "@/components/ResponseCard";
import PipelineProgress from "@/components/PipelineProgress";
import { HealthBridgeResponse } from "@/lib/types";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<HealthBridgeResponse | null>(null);
  const [stats, setStats] = useState({ total_queries: 1240, queries_today: 42 });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    // Fetch stats on mount
    axios.get(`${API_URL}/api/stats`)
      .then(res => setStats(prev => ({ ...prev, ...res.data })))
      .catch(err => console.log("Stats fetch failed, using defaults"));
  }, [API_URL]);

  const handleSubmit = async (data: { text: string; age_group: string; demo_mode: boolean }) => {
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await axios.post(`${API_URL}/api/query`, {
        text: data.text,
        lat: 31.5497, // Default Lahore
        lng: 74.3436,
        age_group: data.age_group,
        demo_mode: data.demo_mode,
        city: "Lahore"
      });

      setResponse(res.data);
    } catch (error) {
      console.error("Query failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="pt-12 pb-8 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl shadow-blue-100 mb-6"
          >
            <div className="relative">
              <Heart size={40} className="text-hb-blue fill-hb-blue/10" />
              <Activity size={20} className="text-hb-red absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </motion.div>
          <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
            HealthBridge
          </h1>
          <p className="text-slate-400 font-medium urdu-text text-lg">
            آپ کی صحت، ہماری ذمہ داری | Your Health, Our Responsibility
          </p>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-around">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-hb-blue rounded-lg">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Families Helped</p>
              <p className="text-sm font-black text-slate-700">{stats.total_queries.toLocaleString()}+</p>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-100" />
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 text-hb-green rounded-lg">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Verified Hospitals</p>
              <p className="text-sm font-black text-slate-700">20 in Lahore</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 pb-20">
        <AnimatePresence mode="wait">
          {!response && !isLoading && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </motion.div>
          )}

          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <PipelineProgress />
            </motion.div>
          )}

          {response && !isLoading && (
            <motion.div
              key="response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ResponseCard data={response} onReset={() => setResponse(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      {!response && !isLoading && (
        <footer className="max-w-2xl mx-auto px-6 text-center text-slate-400 text-xs pb-12">
          <p className="mb-2">HealthBridge is an AI navigation tool and does not provide medical diagnosis.</p>
          <p>Always contact emergency services at 1122 for life-threatening situations.</p>
        </footer>
      )}
    </main>
  );
}
