import Icon from "@/components/ui/icon";
import QRUploader from "@/components/QRUploader";
import type { Building } from "@/data/altgu";
import { S_COMMUNITIES } from "@/data/altgu";

interface Props {
  building: Building;
  onClose: () => void;
  onQRUpdate: (buildingId: string, qrData: string) => void;
  communityQRs: Record<string, string>;
  onCommunityQRUpdate: (key: string, qrData: string) => void;
  buildingPhoto?: string;
  onPhotoUpdate: (buildingId: string, photoData: string) => void;
  floorMapPhoto?: string;
  onFloorMapUpdate: (photoData: string) => void;
  kalasMaphoto?: string;
  onKalashUpdate: (photoData: string) => void;
}

export default function BuildingPanel({
  building,
  onClose,
  onQRUpdate,
  communityQRs,
  onCommunityQRUpdate,
  buildingPhoto,
  onPhotoUpdate,
  floorMapPhoto,
  onFloorMapUpdate,
  kalasMaphoto,
  onKalashUpdate,
}: Props) {
  const isS = building.id === "S";

  return (
    <div
      className="rounded-3xl border bg-agu-card p-5 animate-fade-in overflow-y-auto max-h-[80vh]"
      style={{ borderColor: building.color + "44" }}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center font-montserrat font-black text-white text-lg flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${building.color}, ${building.color}88)` }}
        >
          {building.code}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-montserrat font-bold text-white text-base leading-tight">{building.fullName}</h3>
          <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1">
            <Icon name="MapPin" size={10} />
            {building.address}
          </p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white transition-colors">
          <Icon name="X" size={16} />
        </button>
      </div>

      {/* Photo */}
      <div className="mb-4">
        <PhotoUploader
          value={buildingPhoto}
          onChange={(d) => onPhotoUpdate(building.id, d)}
          label="Фото фасада"
        />
      </div>

      {/* Units */}
      <div className="mb-4">
        <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">Подразделения</p>
        <div className="flex flex-wrap gap-1.5">
          {building.units.map((u) => (
            <span
              key={u}
              className="px-2.5 py-1 rounded-lg text-white/70 text-xs border border-white/10 bg-white/5"
              style={{ borderColor: building.color + "33" }}
            >
              {u}
            </span>
          ))}
        </div>
      </div>

      <p className="text-white/50 text-sm leading-relaxed mb-4">{building.desc}</p>

      {/* QR корпуса (не для СОК и не для С) */}
      {building.hasQR && !isS && (
        <div className="mb-4">
          <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">QR-код корпуса</p>
          <QRUploader
            label={`QR-код · ${building.name}`}
            value={building.qrCode}
            onChange={(d) => onQRUpdate(building.id, d)}
          />
        </div>
      )}

      {/* Особый раздел для Корпуса С */}
      {isS && (
        <div className="space-y-5">
          {/* QR сообществ */}
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Icon name="QrCode" size={12} />
              QR-коды сообществ
            </p>
            <div className="grid grid-cols-3 gap-3">
              {S_COMMUNITIES.map((c) => (
                <QRUploader
                  key={c.name}
                  label={c.name}
                  value={communityQRs[c.name]}
                  onChange={(d) => onCommunityQRUpdate(c.name, d)}
                  small
                />
              ))}
            </div>
          </div>

          {/* Пристройка Калашникова */}
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Icon name="Building" size={12} />
              Пристройка имени Калашникова
            </p>
            <PhotoUploader
              value={kalasMaphoto}
              onChange={onKalashUpdate}
              label="Фото фасада (добавите позже)"
              placeholder
            />
          </div>

          {/* Карта этажей */}
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Icon name="Map" size={12} />
              Карта этажей
            </p>
            <PhotoUploader
              value={floorMapPhoto}
              onChange={onFloorMapUpdate}
              label="Карта этажей (добавите позже)"
              placeholder
            />
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoUploader({
  value,
  onChange,
  label,
  placeholder,
}: {
  value?: string;
  onChange: (d: string) => void;
  label: string;
  placeholder?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) onChange(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (value) {
    return (
      <div className="relative rounded-2xl overflow-hidden group cursor-pointer" onClick={() => inputRef.current?.click()}>
        <img src={value} alt={label} className="w-full h-40 object-cover" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <span className="text-white text-sm flex items-center gap-2">
            <Icon name="RefreshCw" size={14} />
            Заменить фото
          </span>
        </div>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    );
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button
        onClick={() => inputRef.current?.click()}
        className={`w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors ${
          placeholder
            ? "border-white/10 text-white/20 cursor-not-allowed"
            : "border-white/20 hover:border-white/40 text-white/40 hover:text-white/60"
        }`}
        disabled={placeholder}
      >
        <Icon name={placeholder ? "Clock" : "ImagePlus"} size={20} />
        <span className="text-xs">{label}</span>
      </button>
    </div>
  );
}

// need to import useRef in this file
import { useRef } from "react";
