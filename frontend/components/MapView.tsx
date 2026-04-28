"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "./Skeleton";

const MapWithNoSSR = dynamic(() => import("./LeafletMap"), { 
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full rounded-3xl bg-slate-100" />
});

interface MapViewProps {
  hospitals: any[];
  userLocation: [number, number];
}

const MapView: React.FC<MapViewProps> = (props) => {
  return (
    <div className="h-[300px] w-full rounded-3xl overflow-hidden shadow-sm border border-slate-100">
      <MapWithNoSSR {...props} />
    </div>
  );
};

export default MapView;
