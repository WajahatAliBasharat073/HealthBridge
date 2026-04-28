"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet icon issue
const fixLeafletIcon = () => {
  // @ts-ignore
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

const RecenterMap = ({ coords }: { coords: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, 13);
  }, [coords, map]);
  return null;
};

interface LeafletMapProps {
  hospitals: any[];
  userLocation: [number, number];
}

const LeafletMap: React.FC<LeafletMapProps> = ({ hospitals, userLocation }) => {
  useEffect(() => {
    fixLeafletIcon();
  }, []);

  const userIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const hospitalIcons = [
    "green", "blue", "grey"
  ].map(color => new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }));

  return (
    <MapContainer 
      center={userLocation} 
      zoom={13} 
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <Marker position={userLocation} icon={userIcon}>
        <Popup>You are here</Popup>
      </Marker>

      {hospitals.map((hospital, idx) => (
        <Marker 
          key={hospital.id} 
          position={[hospital.lat || 31.5497, hospital.lng || 74.3436]}
          icon={hospitalIcons[idx] || hospitalIcons[0]}
        >
          <Popup>
            <div className="p-1">
              <p className="font-bold text-sm mb-1">{hospital.name}</p>
              <p className="text-xs text-slate-500 mb-2">{hospital.phone}</p>
              <a 
                href={`tel:${hospital.phone}`}
                className="text-xs font-bold text-hb-blue hover:underline"
              >
                Call Now
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
      
      <RecenterMap coords={userLocation} />
    </MapContainer>
  );
};

export default LeafletMap;
