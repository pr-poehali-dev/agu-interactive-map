import { useState, useEffect, useCallback } from "react";

const API = "https://functions.poehali.dev/2248240b-1732-4bc1-bb43-028b2224a65c";

export interface CampusState {
  assets: Record<string, string>;
  positions: Record<string, { lat: number; lng: number }>;
  loading: boolean;
}

export function useCampusData() {
  const [assets, setAssets] = useState<Record<string, string>>({});
  const [positions, setPositions] = useState<Record<string, { lat: number; lng: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, string> = {};
        for (const a of data.assets ?? []) {
          if (a.dataUrl) map[a.key] = a.dataUrl;
        }
        setAssets(map);
        setPositions(data.positions ?? {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveAsset = useCallback(async (key: string, type: string, dataUrl: string) => {
    setAssets((prev) => ({ ...prev, [key]: dataUrl }));
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, type, dataUrl }),
    });
  }, []);

  const savePosition = useCallback(async (buildingId: string, lat: number, lng: number) => {
    setPositions((prev) => ({ ...prev, [buildingId]: { lat, lng } }));
    await fetch(`${API}/position`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buildingId, lat, lng }),
    });
  }, []);

  return { assets, positions, loading, saveAsset, savePosition };
}
