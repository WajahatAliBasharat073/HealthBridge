"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { HospitalInfo } from "@/lib/types";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center rounded-[32px]">
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Map Architecture...</p>
    </div>
  ),
});

interface MapViewProps {
  hospitals: HospitalInfo[];
  userLocation: [number, number];
}

const MapView: React.FC<MapViewProps> = ({ hospitals, userLocation }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full h-[450px] glass rounded-[40px] overflow-hidden p-2 border border-white/50 shadow-2xl"
    >
      <div className="w-full h-full rounded-[32px] overflow-hidden relative border border-slate-100">
        <LeafletMap hospitals={hospitals} userLocation={userLocation} />
      </div>
    </motion.div>
  );
};

export default MapView;
