import { useEffect, useRef, useState, useCallback } from "react";
import type { Building } from "@/data/altgu";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";

interface Props {
  buildings: Building[];
  activeBuilding: string | null;
  onBuildingClick: (id: string) => void;
  editMode: boolean;
  onPositionUpdate: (id: string, lat: number, lng: number) => void;
}

export default function CampusMap({ buildings, activeBuilding, onBuildingClick, editMode, onPositionUpdate }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});
  const [ready, setReady] = useState(false);

  const handleBuildingClick = useCallback((id: string) => onBuildingClick(id), [onBuildingClick]);
  const handlePositionUpdate = useCallback((id: string, lat: number, lng: number) => onPositionUpdate(id, lat, lng), [onPositionUpdate]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      if (!mapRef.current) return;
      const map = L.map(mapRef.current, {
        center: [53.341, 83.771],
        zoom: 13,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      setReady(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        setReady(false);
      }
    };
  }, []);

  useEffect(() => {
    if (!ready || !mapInstanceRef.current) return;

    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};

      buildings.forEach((b) => {
        const isActive = b.id === activeBuilding;
        const size = isActive ? 48 : 40;

        const icon = L.divIcon({
          html: `
            <div style="
              width: ${size}px; height: ${size}px;
              background: linear-gradient(135deg, ${b.color}, ${b.color}99);
              border: 2px solid ${isActive ? b.color : "rgba(255,255,255,0.4)"};
              border-radius: 12px;
              display: flex; align-items: center; justify-content: center;
              font-family: Montserrat, sans-serif;
              font-weight: 900;
              font-size: ${b.code.length > 1 ? "9px" : "14px"};
              color: white;
              box-shadow: 0 4px 20px ${b.color}66${isActive ? `, 0 0 30px ${b.color}` : ""};
              cursor: pointer;
            ">${b.code}</div>
          `,
          className: "",
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        });

        const marker = L.marker([b.lat, b.lng], { icon, draggable: editMode });

        marker.on("click", () => handleBuildingClick(b.id));

        if (editMode) {
          marker.on("dragend", (e) => {
            const pos = (e.target as Marker).getLatLng();
            handlePositionUpdate(b.id, pos.lat, pos.lng);
          });
        }

        marker.addTo(map);
        markersRef.current[b.id] = marker;
      });
    });
  }, [ready, buildings, activeBuilding, editMode, handleBuildingClick, handlePositionUpdate]);

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-white/10">
      <div ref={mapRef} className="w-full h-full" style={{ minHeight: 480 }} />
      <style>{`
        .leaflet-container { background: #0a0e1a !important; font-family: 'Golos Text', sans-serif; }
        .leaflet-tile-pane { filter: brightness(0.85) saturate(1.2); }
        .leaflet-control-attribution { background: rgba(10,14,26,0.8) !important; color: rgba(255,255,255,0.3) !important; font-size: 10px; }
        .leaflet-control-attribution a { color: rgba(0,198,255,0.6) !important; }
        .leaflet-control-zoom a { background: #111827 !important; color: white !important; border-color: rgba(255,255,255,0.15) !important; }
        .leaflet-control-zoom a:hover { background: #1e293b !important; }
      `}</style>
      {editMode && (
        <div className="absolute top-3 left-3 right-3 z-[1000] bg-amber-500/90 backdrop-blur-sm text-black text-sm font-semibold px-4 py-2 rounded-xl text-center pointer-events-none">
          Режим редактирования: перетащите маркеры на нужные места
        </div>
      )}
    </div>
  );
}
