import { useState, lazy, Suspense, useRef } from "react";
import Icon from "@/components/ui/icon";
import { useCampusData } from "@/hooks/useCampusData";
import { BUILDINGS, INSTITUTES, INFRA_ITEMS, S_COMMUNITIES, type Building } from "@/data/altgu";

const CampusMap = lazy(() => import("@/components/CampusMap"));

const NAV_ITEMS = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "map", label: "Карта", icon: "Map" },
  { id: "buildings", label: "Корпусы", icon: "Building2" },
  { id: "about", label: "Об университете", icon: "GraduationCap" },
];

/* ── Photo block ── */
function PhotoBlock({
  value, onChange, label, placeholder,
}: { value?: string; onChange: (d: string) => void; label: string; placeholder?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) onChange(ev.target.result as string); };
    reader.readAsDataURL(file);
  };
  if (value) return (
    <div className="relative rounded-2xl overflow-hidden group cursor-pointer mb-1" onClick={() => ref.current?.click()}>
      <img src={value} alt={label} className="w-full h-36 object-cover" />
      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
        <span className="text-white text-xs flex items-center gap-1"><Icon name="RefreshCw" size={12} />Заменить</span>
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={readFile} />
    </div>
  );
  return (
    <div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={readFile} />
      <button
        onClick={() => { if (!placeholder) ref.current?.click(); }}
        className={`w-full h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 transition-colors ${placeholder ? "border-white/8 text-white/20 cursor-default" : "border-white/20 hover:border-white/35 text-white/40 cursor-pointer"}`}
      >
        <Icon name={placeholder ? "Clock" : "ImagePlus"} size={18} />
        <span className="text-xs">{label}</span>
      </button>
    </div>
  );
}

/* ── Small QR cell ── */
function SmallQR({ label, value, onChange }: { label: string; value?: string; onChange: (d: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) onChange(ev.target.result as string); };
    reader.readAsDataURL(file);
  };
  return (
    <div className="flex flex-col items-center gap-1.5">
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={readFile} />
      {value ? (
        <button onClick={() => ref.current?.click()} className="group relative w-16 h-16">
          <img src={value} alt={label} className="w-full h-full object-contain rounded-xl border border-white/20 bg-white p-1" />
          <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Icon name="Upload" size={12} className="text-white" />
          </div>
        </button>
      ) : (
        <button onClick={() => ref.current?.click()} className="w-16 h-16 rounded-xl border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-0.5 hover:border-white/35 transition-colors">
          <Icon name="QrCode" size={16} className="text-white/25" />
          <span className="text-white/25 text-[8px]">PNG</span>
        </button>
      )}
      <span className="text-white/35 text-[9px] text-center leading-tight">{label}</span>
    </div>
  );
}

/* ── QR Uploader (large) ── */
function QRUpload({ label, value, onChange }: { label: string; value?: string; onChange: (d: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const readFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) onChange(ev.target.result as string); };
    reader.readAsDataURL(file);
  };
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-4">
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={readFile} />
      {value ? (
        <div className="relative group cursor-pointer flex-shrink-0" onClick={() => ref.current?.click()}>
          <img src={value} alt={label} className="w-16 h-16 object-contain rounded-xl bg-white p-1" />
          <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <Icon name="RefreshCw" size={14} className="text-white" />
          </div>
        </div>
      ) : (
        <button onClick={() => ref.current?.click()} className="w-16 h-16 rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-1 hover:border-agu-cyan/50 transition-colors flex-shrink-0">
          <Icon name="Upload" size={16} className="text-white/30" />
          <span className="text-white/30 text-[9px]">PNG</span>
        </button>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-white font-semibold text-sm">{label}</div>
        <div className="text-white/40 text-xs mt-0.5">{value ? "Загружен · нажмите для замены" : "Нажмите для загрузки QR-кода (PNG)"}</div>
      </div>
    </div>
  );
}

/* ── Building panel ── */
interface PanelProps {
  building: Building;
  onClose: () => void;
  assets: Record<string, string>;
  saveAsset: (key: string, type: string, dataUrl: string) => void;
}

function BuildingPanelInline({ building, onClose, assets, saveAsset }: PanelProps) {
  const isS = building.id === "S";
  const photo = assets[`photo_${building.id}`];
  const qr = assets[`qr_${building.id}`];
  const kalash = assets["photo_kalash"];
  const floorMap = assets["photo_floormap_S"];

  return (
    <div className="rounded-3xl border bg-agu-card p-5 animate-fade-in overflow-y-auto" style={{ borderColor: building.color + "44", maxHeight: "78vh" }}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center font-montserrat font-black text-white text-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${building.color}, ${building.color}88)` }}>
          {building.code}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-montserrat font-bold text-white text-base leading-tight">{building.fullName}</h3>
          <p className="text-white/40 text-xs mt-0.5 flex items-center gap-1"><Icon name="MapPin" size={10} />{building.address}</p>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-white/30 hover:text-white transition-colors"><Icon name="X" size={16} /></button>
      </div>

      {/* Фото фасада */}
      <PhotoBlock value={photo} onChange={(d) => saveAsset(`photo_${building.id}`, "photo", d)} label="Добавить фото фасада" />

      {/* Подразделения */}
      <div className="my-4">
        <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">Подразделения</p>
        <div className="flex flex-wrap gap-1.5">
          {building.units.map((u) => (
            <span key={u} className="px-2.5 py-1 rounded-lg text-white/70 text-xs border border-white/10 bg-white/5" style={{ borderColor: building.color + "33" }}>{u}</span>
          ))}
        </div>
      </div>

      <p className="text-white/50 text-sm leading-relaxed mb-4">{building.desc}</p>

      {/* QR корпуса (не для СОК, не для С) */}
      {building.hasQR && !isS && (
        <div className="mb-4">
          <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">QR-код корпуса</p>
          <QRUpload label={`QR-код · ${building.name}`} value={qr} onChange={(d) => saveAsset(`qr_${building.id}`, "qr", d)} />
        </div>
      )}

      {/* Корпус С — расширенный блок */}
      {isS && (
        <div className="space-y-5">
          {/* QR сообществ */}
          <div>
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Icon name="QrCode" size={11} />QR-коды сообществ
            </p>
            <div className="grid grid-cols-3 gap-3">
              {S_COMMUNITIES.map((c) => (
                <SmallQR key={c.name} label={c.name} value={assets[`qr_comm_${c.name}`]} onChange={(d) => saveAsset(`qr_comm_${c.name}`, "qr_community", d)} />
              ))}
            </div>
          </div>

          {/* Схема этажей */}
          <div>
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Icon name="Map" size={11} />Схема этажей корпуса С
            </p>
            {floorMap ? (
              <div className="relative rounded-2xl overflow-hidden group cursor-pointer" onClick={() => {
                const ref = document.getElementById("floor-input-S") as HTMLInputElement;
                ref?.click();
              }}>
                <img src={floorMap} alt="Схема этажей" className="w-full object-contain max-h-72 rounded-2xl" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                  <span className="text-white text-xs flex items-center gap-1"><Icon name="RefreshCw" size={12} />Заменить</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { const el = document.getElementById("floor-input-S") as HTMLInputElement; el?.click(); }}
                className="w-full h-32 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 hover:border-white/35 text-white/40 transition-colors"
              >
                <Icon name="ImagePlus" size={20} />
                <span className="text-xs">Загрузить схему этажей</span>
              </button>
            )}
            <input
              id="floor-input-S"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => { if (ev.target?.result) saveAsset("photo_floormap_S", "floor_map", ev.target.result as string); };
                reader.readAsDataURL(file);
              }}
            />
          </div>

          {/* Пристройка Калашникова */}
          <div>
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Icon name="Building" size={11} />Пристройка имени Калашникова
            </p>
            <PhotoBlock value={kalash} onChange={(d) => saveAsset("photo_kalash", "photo", d)} label="Фото добавите позже" placeholder />
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════ MAIN PAGE ══════════════════ */
export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [activeBuilding, setActiveBuilding] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showCollegeQR, setShowCollegeQR] = useState(false);
  const [expandedInstitute, setExpandedInstitute] = useState<number | null>(null);

  const { assets, positions, loading, saveAsset, savePosition } = useCampusData();

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const buildingsResolved: Building[] = BUILDINGS.map((b) => ({
    ...b,
    ...(positions[b.id] ?? {}),
  }));

  const activeBuildingData = buildingsResolved.find((b) => b.id === activeBuilding);

  return (
    <div className="min-h-screen bg-agu-dark font-golos text-white overflow-x-hidden">
      {/* BG mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-agu-dark/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-agu-cyan to-agu-violet flex items-center justify-center">
              <Icon name="GraduationCap" size={18} className="text-white" />
            </div>
            <div>
              <span className="font-montserrat font-extrabold text-white text-lg leading-none tracking-tight">АлтГУ</span>
              <p className="text-white/40 text-[10px] leading-none">Карта кампуса</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${activeSection === item.id ? "bg-gradient-to-r from-agu-cyan/20 to-agu-violet/20 text-agu-cyan border border-agu-cyan/30" : "text-white/60 hover:text-white hover:bg-white/5"}`}>
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </div>
          <button className="md:hidden p-2 rounded-lg text-white/60 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-agu-dark/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button key={item.id} onClick={() => scrollTo(item.id)} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all">
                <Icon name={item.icon} size={16} />{item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ═══ HERO (без картинки) ═══ */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center pt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center text-center">
          <div className="animate-fade-in max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-agu-cyan/30 bg-agu-cyan/10 text-agu-cyan text-sm font-medium mb-8">
              <Icon name="MapPin" size={14} />Барнаул, Алтайский край
            </div>
            <h1 className="font-montserrat font-black text-6xl sm:text-7xl lg:text-8xl leading-none mb-6">
              <span className="block text-white">Кампус</span>
              <span className="block bg-gradient-to-r from-agu-cyan via-violet-400 to-agu-orange bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">АлтГУ</span>
            </h1>
            <p className="text-white/60 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl mx-auto">
              Интерактивная карта кампуса Алтайского государственного университета — корпуса, институты, инфраструктура и QR-навигация
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => scrollTo("map")} className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-agu-cyan to-agu-violet text-white font-semibold text-lg hover:scale-105 transition-transform duration-200 animate-pulse-glow">
                <Icon name="Map" size={20} />Открыть карту
              </button>
              <button onClick={() => scrollTo("buildings")} className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/20 text-white/80 hover:border-white/40 hover:text-white transition-all duration-200 text-lg">
                <Icon name="Building2" size={20} />Корпусы
              </button>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t border-white/10 max-w-md mx-auto">
              {[{ value: "9", label: "Институтов" }, { value: "20k+", label: "Студентов" }, { value: "1973", label: "Год основания" }].map((s) => (
                <div key={s.label}>
                  <div className="font-montserrat font-black text-4xl bg-gradient-to-r from-agu-cyan to-agu-violet bg-clip-text text-transparent">{s.value}</div>
                  <div className="text-white/40 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating cards под текстом */}
          <div className="flex flex-wrap justify-center gap-4 mt-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {BUILDINGS.map((b) => (
              <button
                key={b.id}
                onClick={() => { scrollTo("map"); setTimeout(() => setActiveBuilding(b.id), 400); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10 transition-all"
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center font-montserrat font-bold text-white text-[10px]" style={{ background: b.color }}>{b.code}</div>
                <span className="text-white/60 text-sm">{b.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-float">
          <span className="text-xs tracking-widest uppercase">Прокрутите</span>
          <Icon name="ChevronDown" size={18} />
        </div>
      </section>

      {/* ═══ MAP ═══ */}
      <section id="map" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-agu-violet/30 bg-agu-violet/10 text-violet-400 text-sm mb-4">
              <Icon name="Map" size={14} />Интерактивная карта
            </div>
            <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white mb-3">
              Карта <span className="bg-gradient-to-r from-agu-violet to-agu-cyan bg-clip-text text-transparent">Барнаула</span>
            </h2>
            <p className="text-white/50 max-w-lg mx-auto text-sm">Нажмите на маркер корпуса для просмотра информации и QR-кодов</p>
          </div>

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${editMode ? "bg-amber-500/20 border border-amber-500/50 text-amber-400" : "border border-white/15 text-white/50 hover:text-white hover:border-white/30"}`}
            >
              <Icon name={editMode ? "Lock" : "Move"} size={14} />
              {editMode ? "Сохранить позиции" : "Переставить маркеры"}
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2" style={{ height: 520 }}>
              {loading ? (
                <div className="w-full h-full rounded-3xl border border-white/10 bg-agu-card flex items-center justify-center">
                  <div className="text-white/30 flex flex-col items-center gap-3">
                    <Icon name="Loader2" size={32} className="animate-spin" />
                    <span className="text-sm">Загрузка данных...</span>
                  </div>
                </div>
              ) : (
                <Suspense fallback={
                  <div className="w-full h-full rounded-3xl border border-white/10 bg-agu-card flex items-center justify-center">
                    <Icon name="Loader2" size={32} className="text-white/30 animate-spin" />
                  </div>
                }>
                  <CampusMap
                    buildings={buildingsResolved}
                    activeBuilding={activeBuilding}
                    onBuildingClick={(id) => setActiveBuilding(activeBuilding === id ? null : id)}
                    editMode={editMode}
                    onPositionUpdate={savePosition}
                  />
                </Suspense>
              )}
            </div>

            <div className="flex flex-col gap-3">
              {activeBuildingData ? (
                <BuildingPanelInline
                  building={activeBuildingData}
                  onClose={() => setActiveBuilding(null)}
                  assets={assets}
                  saveAsset={saveAsset}
                />
              ) : (
                <div className="rounded-3xl border border-white/10 bg-agu-card p-6 flex flex-col items-center justify-center text-center gap-4" style={{ minHeight: 180 }}>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Icon name="MousePointer2" size={24} className="text-white/30" />
                  </div>
                  <div>
                    <p className="text-white/50 font-medium">Выберите корпус</p>
                    <p className="text-white/25 text-sm mt-1">Нажмите на маркер на карте</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {buildingsResolved.map((b) => (
                  <button key={b.id} onClick={() => setActiveBuilding(b.id === activeBuilding ? null : b.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 text-left ${activeBuilding === b.id ? "border-white/25 bg-white/10" : "border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/10"}`}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center font-montserrat font-bold text-white text-xs flex-shrink-0" style={{ background: b.color }}>{b.code}</div>
                    <div className="flex-1 min-w-0">
                      <span className="text-white/70 text-sm block truncate">{b.name}</span>
                      <span className="text-white/30 text-xs">{b.address}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ INSTITUTES ═══ */}
      <section id="buildings" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-agu-orange/30 bg-agu-orange/10 text-orange-400 text-sm mb-4">
              <Icon name="Building2" size={14} />9 институтов и Колледж
            </div>
            <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white mb-4">
              Академические <span className="bg-gradient-to-r from-agu-orange to-agu-cyan bg-clip-text text-transparent">подразделения</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
            {INSTITUTES.map((inst, i) => {
              const isOpen = expandedInstitute === i;
              const qrKey = `qr_institute_${inst.shortName}`;
              const qrVal = assets[qrKey];
              return (
                <div key={inst.shortName} className={`group relative rounded-3xl border bg-agu-card overflow-hidden transition-all duration-300 ${isOpen ? "border-white/20" : "border-white/10 hover:border-white/20 hover:-translate-y-1"}`}>
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${inst.color} transition-opacity duration-300`} />
                  <div className="relative p-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${inst.color} flex items-center justify-center mb-4`}>
                      <Icon name={inst.icon} size={22} className="text-white" />
                    </div>
                    <p className="font-montserrat font-black text-agu-cyan text-xs mb-1 uppercase tracking-wider">{inst.shortName}</p>
                    <h3 className="font-montserrat font-bold text-white text-sm leading-tight mb-3">{inst.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs">Корпус {inst.building}</span>
                      <button
                        onClick={() => setExpandedInstitute(isOpen ? null : i)}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${isOpen ? "text-agu-cyan" : "text-white/30 hover:text-white/60"}`}
                      >
                        <Icon name="QrCode" size={13} />
                        QR
                        <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={13} />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                        <QRUpload
                          label={`QR-код · ${inst.shortName}`}
                          value={qrVal}
                          onChange={(d) => saveAsset(qrKey, "qr_institute", d)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Колледж */}
          <div className="rounded-3xl border border-emerald-500/30 bg-agu-card p-6 mb-20 cursor-pointer hover:border-emerald-500/50 transition-all" onClick={() => setShowCollegeQR(!showCollegeQR)}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 flex items-center justify-center flex-shrink-0">
                <Icon name="GraduationCap" size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-montserrat font-black text-emerald-400 text-xs mb-1 uppercase tracking-wider">Колледж</p>
                <h3 className="font-montserrat font-bold text-white text-base">Колледж Алтайского государственного университета</h3>
                <p className="text-white/50 text-sm mt-1">Среднее профессиональное образование на базе АлтГУ</p>
              </div>
              <Icon name={showCollegeQR ? "ChevronUp" : "ChevronDown"} size={18} className="text-white/30 mt-1 flex-shrink-0" />
            </div>
            {showCollegeQR && (
              <div className="mt-5 pt-5 border-t border-white/10 animate-fade-in" onClick={(e) => e.stopPropagation()}>
                <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-3">QR-код Колледжа</p>
                <QRUpload label="QR-код · Колледж АлтГУ" value={assets["qr_college"]} onChange={(d) => saveAsset("qr_college", "qr", d)} />
              </div>
            )}
          </div>

          {/* Инфраструктура */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-agu-green/30 bg-agu-green/10 text-emerald-400 text-sm mb-4">
              <Icon name="Layers" size={14} />Инфраструктура
            </div>
            <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white mb-4">
              Объекты <span className="bg-gradient-to-r from-agu-green to-agu-cyan bg-clip-text text-transparent">кампуса</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INFRA_ITEMS.map((inf) => (
              <div key={inf.name} className="flex items-start gap-4 rounded-3xl border border-white/10 bg-agu-card p-5 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: inf.color + "22", border: `1px solid ${inf.color}44` }}>
                  <Icon name={inf.icon} size={20} style={{ color: inf.color }} />
                </div>
                <div>
                  <h4 className="font-montserrat font-bold text-white text-sm mb-1">{inf.name}</h4>
                  <p className="text-white/40 text-xs leading-relaxed">{inf.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section id="about" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-[2rem] overflow-hidden border border-white/10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-agu-blue/30 via-agu-dark to-agu-violet/20" />
            <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(0,198,255,0.1) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(124,58,237,0.1) 0%, transparent 60%)" }} />
            <div className="relative z-10 p-8 sm:p-12 lg:p-16">
              <div className="grid lg:grid-cols-2 gap-12 items-start">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white/60 text-sm mb-6">
                    <Icon name="Info" size={14} />Об университете
                  </div>
                  <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white leading-none mb-6">
                    Алтайский <br />
                    <span className="bg-gradient-to-r from-agu-cyan to-agu-violet bg-clip-text text-transparent">государственный</span>
                    <br />университет
                  </h2>
                  <p className="text-white/60 text-lg leading-relaxed mb-5">
                    Алтайский государственный университет — ведущий классический университет Сибири, основанный в 1973 году. АлтГУ — крупнейший научный и образовательный центр Алтайского края с развитой инфраструктурой и богатыми академическими традициями.
                  </p>
                  <p className="text-white/50 text-base leading-relaxed mb-8">
                    В составе университета 9 институтов, колледж, спортивно-оздоровительный комплекс и студенческая поликлиника (ул. Юрина, 166а). Кампус включает 6 корпусов по всему Барнаулу.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["Аккредитован", "Государственный", "Барнаул", "Сибирь"].map((tag) => (
                      <span key={tag} className="px-4 py-2 rounded-full border border-white/15 text-white/60 text-sm">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "1973", label: "Год основания", icon: "Calendar", color: "#00c6ff" },
                    { value: "9", label: "Институтов", icon: "Building2", color: "#7c3aed" },
                    { value: "20 000+", label: "Студентов", icon: "Users", color: "#00d4a0" },
                    { value: "1 500+", label: "Преподавателей", icon: "UserCheck", color: "#ff6b35" },
                    { value: "100+", label: "Специальностей", icon: "BookOpen", color: "#f59e0b" },
                    { value: "6", label: "Корпусов", icon: "MapPin", color: "#ec4899" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: stat.color + "22" }}>
                        <Icon name={stat.icon} size={18} style={{ color: stat.color }} />
                      </div>
                      <div className="font-montserrat font-black text-white text-2xl">{stat.value}</div>
                      <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="font-montserrat font-bold text-white text-xl mb-6 flex items-center gap-2">
                  <Icon name="Building2" size={20} className="text-agu-cyan" />Корпуса АлтГУ
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {BUILDINGS.map((b) => (
                    <div key={b.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-3 cursor-pointer hover:border-white/20 transition-all"
                      onClick={() => { scrollTo("map"); setTimeout(() => setActiveBuilding(b.id), 400); }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-montserrat font-black text-white text-xs flex-shrink-0" style={{ background: b.color }}>{b.code}</div>
                      <div>
                        <div className="text-white font-semibold text-sm">{b.name}</div>
                        <div className="text-white/40 text-xs mt-0.5">{b.address}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-agu-cyan to-agu-violet flex items-center justify-center">
              <Icon name="GraduationCap" size={16} className="text-white" />
            </div>
            <span className="font-montserrat font-bold text-white">АлтГУ</span>
            <span className="text-white/30 text-sm">© 2024</span>
          </div>
          <p className="text-white/30 text-sm text-center">Алтайский государственный университет · Барнаул</p>
          <div className="flex items-center gap-3">
            <a href="https://www.asu.ru" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
              <Icon name="Globe" size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
              <Icon name="Phone" size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
              <Icon name="Mail" size={16} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
