import { useState, lazy, Suspense, useRef } from "react";
import Icon from "@/components/ui/icon";
import QRUploader from "@/components/QRUploader";
import { BUILDINGS, INSTITUTES, INFRA_ITEMS, S_COMMUNITIES, type Building } from "@/data/altgu";

const CampusMap = lazy(() => import("@/components/CampusMap"));

const NAV_ITEMS = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "map", label: "Карта", icon: "Map" },
  { id: "buildings", label: "Корпусы", icon: "Building2" },
  { id: "about", label: "Об университете", icon: "GraduationCap" },
];

const HERO_IMAGE = "https://cdn.poehali.dev/projects/a49f9ee1-8131-4343-9ff6-baf164468591/files/78a79ccc-bce9-4a83-8dbf-c7b6268521bb.jpg";

/* ── Photo block helper ── */
function PhotoBlock({ value, onChange, label, placeholder }: { value?: string; onChange: (d: string) => void; label: string; placeholder?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
  return (
    <div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
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

/* ── Small QR helper ── */
function SmallQR({ label, value, onChange }: { label: string; value?: string; onChange: (d: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { if (ev.target?.result) onChange(ev.target.result as string); };
    reader.readAsDataURL(file);
  };
  return (
    <div className="flex flex-col items-center gap-1.5">
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleFile} />
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

/* ── Building panel ── */
interface PanelProps {
  building: Building;
  onClose: () => void;
  buildingQRs: Record<string, string>;
  onQRUpdate: (id: string, qr: string) => void;
  communityQRs: Record<string, string>;
  onCommunityQRUpdate: (k: string, v: string) => void;
  buildingPhotos: Record<string, string>;
  onPhotoUpdate: (id: string, p: string) => void;
  floorMapPhoto?: string;
  onFloorMapUpdate: (p: string) => void;
  kalashPhoto?: string;
  onKalashUpdate: (p: string) => void;
}

function BuildingPanelInline({
  building, onClose,
  buildingQRs, onQRUpdate,
  communityQRs, onCommunityQRUpdate,
  buildingPhotos, onPhotoUpdate,
  floorMapPhoto, onFloorMapUpdate,
  kalashPhoto, onKalashUpdate,
}: PanelProps) {
  const isS = building.id === "S";
  const photo = buildingPhotos[building.id];

  return (
    <div
      className="rounded-3xl border bg-agu-card p-5 animate-fade-in overflow-y-auto"
      style={{ borderColor: building.color + "44", maxHeight: "78vh" }}
    >
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

      <PhotoBlock value={photo} onChange={(d) => onPhotoUpdate(building.id, d)} label="Добавить фото фасада" />

      <div className="my-4">
        <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">Подразделения</p>
        <div className="flex flex-wrap gap-1.5">
          {building.units.map((u) => (
            <span key={u} className="px-2.5 py-1 rounded-lg text-white/70 text-xs border border-white/10 bg-white/5" style={{ borderColor: building.color + "33" }}>{u}</span>
          ))}
        </div>
      </div>

      <p className="text-white/50 text-sm leading-relaxed mb-4">{building.desc}</p>

      {building.hasQR && !isS && (
        <div className="mb-4">
          <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2">QR-код корпуса</p>
          <QRUploader label={`QR-код · ${building.name}`} value={buildingQRs[building.id]} onChange={(d) => onQRUpdate(building.id, d)} />
        </div>
      )}

      {isS && (
        <div className="space-y-5">
          <div>
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Icon name="QrCode" size={11} />QR-коды сообществ
            </p>
            <div className="grid grid-cols-3 gap-3">
              {S_COMMUNITIES.map((c) => (
                <SmallQR key={c.name} label={c.name} value={communityQRs[c.name]} onChange={(d) => onCommunityQRUpdate(c.name, d)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Icon name="Building" size={11} />Пристройка имени Калашникова
            </p>
            <PhotoBlock value={kalashPhoto} onChange={onKalashUpdate} label="Фото добавите позже" placeholder />
          </div>

          <div>
            <p className="text-white/40 text-[10px] font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Icon name="Map" size={11} />Карта этажей корпуса С
            </p>
            <PhotoBlock value={floorMapPhoto} onChange={onFloorMapUpdate} label="Карту этажей добавите позже" placeholder />
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
  const [positions, setPositions] = useState<Record<string, { lat: number; lng: number }>>({});
  const [buildingQRs, setBuildingQRs] = useState<Record<string, string>>({});
  const [communityQRs, setCommunityQRs] = useState<Record<string, string>>({});
  const [buildingPhotos, setBuildingPhotos] = useState<Record<string, string>>({});
  const [floorMapPhoto, setFloorMapPhoto] = useState<string | undefined>();
  const [kalashPhoto, setKalashPhoto] = useState<string | undefined>();
  const [collegeQR, setCollegeQR] = useState<string | undefined>();
  const [showCollegeQR, setShowCollegeQR] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const buildingsResolved: Building[] = BUILDINGS.map((b) => ({
    ...b,
    ...(positions[b.id] ?? {}),
    ...(buildingQRs[b.id] ? { qrCode: buildingQRs[b.id] } : {}),
  }));

  const activeBuildingData = buildingsResolved.find((b) => b.id === activeBuilding);

  return (
    <div className="min-h-screen bg-agu-dark font-golos text-white overflow-x-hidden">
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

      {/* ═══ HERO ═══ */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center pt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-agu-cyan/30 bg-agu-cyan/10 text-agu-cyan text-sm font-medium mb-6">
              <Icon name="MapPin" size={14} />Барнаул, Алтайский край
            </div>
            <h1 className="font-montserrat font-black text-5xl sm:text-6xl lg:text-7xl leading-none mb-6">
              <span className="block text-white">Кампус</span>
              <span className="block bg-gradient-to-r from-agu-cyan via-violet-400 to-agu-orange bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">АлтГУ</span>
            </h1>
            <p className="text-white/60 text-lg sm:text-xl leading-relaxed mb-8 max-w-md">
              Интерактивная карта кампуса Алтайского государственного университета — корпуса, институты, инфраструктура и QR-навигация
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => scrollTo("map")} className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-agu-cyan to-agu-violet text-white font-semibold hover:scale-105 transition-transform duration-200 animate-pulse-glow">
                <Icon name="Map" size={18} />Открыть карту
              </button>
              <button onClick={() => scrollTo("buildings")} className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/20 text-white/80 hover:border-white/40 hover:text-white transition-all duration-200">
                <Icon name="Building2" size={18} />Корпусы
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              {[{ value: "9", label: "Институтов" }, { value: "20k+", label: "Студентов" }, { value: "1973", label: "Год основания" }].map((s) => (
                <div key={s.label}>
                  <div className="font-montserrat font-black text-3xl bg-gradient-to-r from-agu-cyan to-agu-violet bg-clip-text text-transparent">{s.value}</div>
                  <div className="text-white/40 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <img src={HERO_IMAGE} alt="Кампус АлтГУ" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-agu-dark/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex gap-3 flex-wrap">
                {["Главный корпус М", "2024/25", "Барнаул"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-xs border border-white/20">{tag}</span>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-agu-card border border-white/10 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm shadow-2xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agu-cyan to-agu-violet flex items-center justify-center">
                <Icon name="Navigation" size={18} className="text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">QR-навигация</div>
                <div className="text-white/40 text-xs">У каждого корпуса</div>
              </div>
            </div>
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
              <Suspense fallback={
                <div className="w-full h-full rounded-3xl border border-white/10 bg-agu-card flex items-center justify-center">
                  <div className="text-white/30 flex flex-col items-center gap-3">
                    <Icon name="Loader2" size={32} className="animate-spin" />
                    <span className="text-sm">Загрузка карты...</span>
                  </div>
                </div>
              }>
                <CampusMap
                  buildings={buildingsResolved}
                  activeBuilding={activeBuilding}
                  onBuildingClick={(id) => setActiveBuilding(activeBuilding === id ? null : id)}
                  editMode={editMode}
                  onPositionUpdate={(id, lat, lng) => setPositions((p) => ({ ...p, [id]: { lat, lng } }))}
                />
              </Suspense>
            </div>

            <div className="flex flex-col gap-3">
              {activeBuildingData ? (
                <BuildingPanelInline
                  building={activeBuildingData}
                  onClose={() => setActiveBuilding(null)}
                  buildingQRs={buildingQRs}
                  onQRUpdate={(id, qr) => setBuildingQRs((p) => ({ ...p, [id]: qr }))}
                  communityQRs={communityQRs}
                  onCommunityQRUpdate={(k, v) => setCommunityQRs((p) => ({ ...p, [k]: v }))}
                  buildingPhotos={buildingPhotos}
                  onPhotoUpdate={(id, p) => setBuildingPhotos((prev) => ({ ...prev, [id]: p }))}
                  floorMapPhoto={floorMapPhoto}
                  onFloorMapUpdate={setFloorMapPhoto}
                  kalashPhoto={kalashPhoto}
                  onKalashUpdate={setKalashPhoto}
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

      {/* ═══ BUILDINGS / INSTITUTES ═══ */}
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
            {INSTITUTES.map((inst) => (
              <div key={inst.shortName} className="group relative rounded-3xl border border-white/10 bg-agu-card p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${inst.color} transition-opacity duration-300`} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${inst.color} flex items-center justify-center mb-4`}>
                  <Icon name={inst.icon} size={22} className="text-white" />
                </div>
                <p className="font-montserrat font-black text-agu-cyan text-xs mb-1 uppercase tracking-wider">{inst.shortName}</p>
                <h3 className="font-montserrat font-bold text-white text-sm leading-tight mb-2">{inst.name}</h3>
                <span className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-white/40 text-xs">Корпус {inst.building}</span>
              </div>
            ))}
          </div>

          {/* Колледж */}
          <div
            className="rounded-3xl border border-emerald-500/30 bg-agu-card p-6 mb-20 cursor-pointer hover:border-emerald-500/50 transition-all"
            onClick={() => setShowCollegeQR(!showCollegeQR)}
          >
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
                <QRUploader label="QR-код · Колледж АлтГУ" value={collegeQR} onChange={setCollegeQR} />
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
                    В составе университета 9 институтов, колледж, спортивно-оздоровительный комплекс и студенческая поликлиника (ул. Юрина, 166а). Кампус включает 6 корпусов, расположенных по всему Барнаулу.
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
                  <Icon name="Building2" size={20} className="text-agu-cyan" />
                  Корпуса АлтГУ
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
