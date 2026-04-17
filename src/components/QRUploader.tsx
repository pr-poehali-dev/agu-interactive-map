import { useRef } from "react";
import Icon from "@/components/ui/icon";

interface Props {
  label: string;
  value?: string;
  onChange: (dataUrl: string) => void;
  small?: boolean;
}

export default function QRUploader({ label, value, onChange, small }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) onChange(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (small) {
    return (
      <div className="flex flex-col items-center gap-2">
        <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={handleFile} />
        {value ? (
          <button onClick={() => inputRef.current?.click()} className="group relative">
            <img src={value} alt={label} className="w-20 h-20 object-contain rounded-xl border border-white/20 bg-white p-1" />
            <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Icon name="Upload" size={16} className="text-white" />
            </div>
          </button>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-20 h-20 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1 hover:border-white/40 transition-colors"
          >
            <Icon name="QrCode" size={18} className="text-white/30" />
            <span className="text-white/30 text-[9px]">Загрузить</span>
          </button>
        )}
        <span className="text-white/40 text-[10px] text-center leading-tight">{label}</span>
      </div>
    );
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/svg+xml" className="hidden" onChange={handleFile} />
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-4">
        {value ? (
          <div className="relative group cursor-pointer flex-shrink-0" onClick={() => inputRef.current?.click()}>
            <img src={value} alt={label} className="w-16 h-16 object-contain rounded-xl bg-white p-1" />
            <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Icon name="RefreshCw" size={14} className="text-white" />
            </div>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-16 h-16 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1 hover:border-agu-cyan/50 transition-colors flex-shrink-0"
          >
            <Icon name="Upload" size={16} className="text-white/30" />
            <span className="text-white/30 text-[9px]">PNG</span>
          </button>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-white font-semibold text-sm">{label}</div>
          <div className="text-white/40 text-xs mt-0.5">
            {value ? "QR-код загружен · нажмите для замены" : "Нажмите для загрузки QR-кода (PNG)"}
          </div>
        </div>
      </div>
    </div>
  );
}
