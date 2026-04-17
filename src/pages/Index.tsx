import { useState } from "react";
import Icon from "@/components/ui/icon";

const CAMPUS_IMAGE = "https://cdn.poehali.dev/projects/a49f9ee1-8131-4343-9ff6-baf164468591/files/78a79ccc-bce9-4a83-8dbf-c7b6268521bb.jpg";

const NAV_ITEMS = [
  { id: "home", label: "Главная", icon: "Home" },
  { id: "map", label: "Карта", icon: "Map" },
  { id: "buildings", label: "Корпусы", icon: "Building2" },
  { id: "about", label: "Об университете", icon: "GraduationCap" },
];

const BUILDINGS = [
  { id: 1, name: "Главный корпус", code: "А", x: 38, y: 42, color: "#00c6ff", desc: "Ректорат, деканаты, актовый зал" },
  { id: 2, name: "Корпус Б", code: "Б", x: 55, y: 35, color: "#7c3aed", desc: "Естественные науки, лаборатории" },
  { id: 3, name: "Корпус В", code: "В", x: 65, y: 55, color: "#00d4a0", desc: "Гуманитарные факультеты" },
  { id: 4, name: "Библиотека", code: "Б", x: 30, y: 60, color: "#ff6b35", desc: "Научная библиотека, читальные залы" },
  { id: 5, name: "Спортивный комплекс", code: "С", x: 72, y: 38, color: "#f59e0b", desc: "Залы, бассейн, стадион" },
  { id: 6, name: "Студенческий городок", code: "Д", x: 48, y: 70, color: "#ec4899", desc: "Общежития, столовая, досуг" },
];

const INSTITUTES = [
  { name: "Институт физики и математики", icon: "Calculator", color: "from-blue-600 to-cyan-500", students: "1 240", programs: 8 },
  { name: "Институт истории и права", icon: "Scale", color: "from-violet-600 to-purple-500", students: "980", programs: 6 },
  { name: "Институт педагогики и психологии", icon: "Brain", color: "from-emerald-600 to-teal-500", students: "1 560", programs: 10 },
  { name: "Институт экономики и управления", icon: "TrendingUp", color: "from-orange-600 to-amber-500", students: "1 100", programs: 7 },
  { name: "Институт искусств и культуры", icon: "Palette", color: "from-pink-600 to-rose-500", students: "640", programs: 5 },
  { name: "Адыгейский колледж", icon: "BookOpen", color: "from-indigo-600 to-blue-500", students: "820", programs: 12 },
];

const INFRASTRUCTURE = [
  { name: "Библиотека", desc: "800 000+ изданий, электронный каталог", icon: "Library", color: "#00c6ff" },
  { name: "Спорткомплекс", desc: "Бассейн, тренажёрные залы, стадион", icon: "Dumbbell", color: "#00d4a0" },
  { name: "Медпункт", desc: "Круглосуточная медицинская помощь", icon: "HeartPulse", color: "#ff6b35" },
  { name: "Столовые", desc: "3 столовых, 5 кафе на территории", icon: "UtensilsCrossed", color: "#7c3aed" },
  { name: "Общежития", desc: "4 корпуса, 2 400 мест проживания", icon: "Home", color: "#f59e0b" },
  { name: "Wi-Fi Campus", desc: "Беспроводной интернет по всей территории", icon: "Wifi", color: "#ec4899" },
];

const QR_CODES = [
  { name: "Главный корпус А", qrData: "10101001101100101" },
  { name: "Корпус Б", qrData: "01100110010011001" },
  { name: "Библиотека", qrData: "11001010110100110" },
];

export default function Index() {
  const [activeSection, setActiveSection] = useState("home");
  const [activeBuilding, setActiveBuilding] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-agu-dark font-golos text-white overflow-x-hidden">
      {/* Animated background mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-agu-dark/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-agu-cyan to-agu-violet flex items-center justify-center">
              <Icon name="GraduationCap" size={18} className="text-white" />
            </div>
            <div>
              <span className="font-montserrat font-extrabold text-white text-lg leading-none tracking-tight">АГУ</span>
              <p className="text-white/40 text-[10px] leading-none">Карта кампуса</p>
            </div>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? "bg-gradient-to-r from-agu-cyan/20 to-agu-violet/20 text-agu-cyan border border-agu-cyan/30"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </button>
            ))}
          </div>

          <button
            className="md:hidden p-2 rounded-lg text-white/60 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-agu-dark/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/5 transition-all"
              >
                <Icon name={item.icon} size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative min-h-screen flex flex-col justify-center pt-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-agu-cyan/30 bg-agu-cyan/10 text-agu-cyan text-sm font-medium mb-6">
              <Icon name="MapPin" size={14} />
              Майкоп, Республика Адыгея
            </div>
            <h1 className="font-montserrat font-black text-5xl sm:text-6xl lg:text-7xl leading-none mb-6">
              <span className="block text-white">Кампус</span>
              <span className="block bg-gradient-to-r from-agu-cyan via-violet-400 to-agu-orange bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
                АГУ
              </span>
            </h1>
            <p className="text-white/60 text-lg sm:text-xl leading-relaxed mb-8 max-w-md">
              Интерактивная карта кампуса, корпусов, инфраструктуры и институтов Адыгейского государственного университета
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("map")}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-agu-cyan to-agu-violet text-white font-semibold hover:scale-105 transition-transform duration-200 animate-pulse-glow"
              >
                <Icon name="Map" size={18} />
                Открыть карту
              </button>
              <button
                onClick={() => scrollTo("buildings")}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/20 text-white/80 hover:border-white/40 hover:text-white transition-all duration-200"
              >
                <Icon name="Building2" size={18} />
                Корпусы
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              {[
                { value: "6", label: "Институтов" },
                { value: "12k+", label: "Студентов" },
                { value: "1929", label: "Год основания" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="font-montserrat font-black text-3xl bg-gradient-to-r from-agu-cyan to-agu-violet bg-clip-text text-transparent">{s.value}</div>
                  <div className="text-white/40 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <div className="relative rounded-3xl overflow-hidden aspect-[4/3]">
              <img
                src={CAMPUS_IMAGE}
                alt="Кампус АГУ"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-agu-dark/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex gap-3 flex-wrap">
                {["Главный корпус", "2024/25", "Майкоп"].map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-xs border border-white/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 bg-agu-card border border-white/10 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-sm shadow-2xl">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agu-cyan to-agu-violet flex items-center justify-center">
                <Icon name="Navigation" size={18} className="text-white" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Навигация</div>
                <div className="text-white/40 text-xs">QR-коды у каждого корпуса</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 animate-float">
          <span className="text-xs tracking-widest uppercase">Прокрутите</span>
          <Icon name="ChevronDown" size={18} />
        </div>
      </section>

      {/* MAP */}
      <section id="map" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-agu-violet/30 bg-agu-violet/10 text-violet-400 text-sm mb-4">
              <Icon name="Map" size={14} />
              Интерактивная карта
            </div>
            <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white mb-4">
              Карта <span className="bg-gradient-to-r from-agu-violet to-agu-cyan bg-clip-text text-transparent">кампуса</span>
            </h2>
            <p className="text-white/50 max-w-lg mx-auto">Нажмите на точку, чтобы узнать подробнее о корпусе</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 relative rounded-3xl overflow-hidden border border-white/10 bg-agu-card" style={{ minHeight: 420 }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-agu-dark to-violet-950/40" />
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `linear-gradient(rgba(0,198,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,198,255,0.3) 1px, transparent 1px)`,
                  backgroundSize: "40px 40px"
                }}
              />
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <polygon
                  points="20,25 80,20 85,75 15,78"
                  fill="rgba(0,198,255,0.04)"
                  stroke="rgba(0,198,255,0.2)"
                  strokeWidth="0.3"
                />
                <line x1="20" y1="50" x2="85" y2="50" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" strokeDasharray="2,2" />
                <line x1="50" y1="25" x2="50" y2="78" stroke="rgba(255,255,255,0.08)" strokeWidth="0.4" strokeDasharray="2,2" />
              </svg>

              {BUILDINGS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBuilding(activeBuilding === b.id ? null : b.id)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${b.x}%`, top: `${b.y}%` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-montserrat font-black text-white text-sm transition-all duration-300 group-hover:scale-125"
                    style={{
                      background: `linear-gradient(135deg, ${b.color}, ${b.color}88)`,
                      boxShadow: activeBuilding === b.id ? `0 0 20px ${b.color}` : `0 4px 20px ${b.color}44`,
                      border: activeBuilding === b.id ? `2px solid ${b.color}` : "2px solid transparent",
                      transform: activeBuilding === b.id ? "scale(1.2)" : undefined
                    }}
                  >
                    {b.code}
                  </div>
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20"
                    style={{ background: b.color + "cc", backdropFilter: "blur(8px)" }}
                  >
                    {b.name}
                  </div>
                </button>
              ))}

              <div className="absolute bottom-4 left-4 text-white/30 text-xs">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded border border-agu-cyan/40 bg-agu-cyan/10" />
                  <span>Территория кампуса</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {activeBuilding ? (
                (() => {
                  const b = BUILDINGS.find((x) => x.id === activeBuilding)!;
                  return (
                    <div className="rounded-3xl border bg-agu-card p-6 animate-fade-in" style={{ borderColor: b.color + "44" }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-montserrat font-black text-white text-xl"
                          style={{ background: `linear-gradient(135deg, ${b.color}, ${b.color}88)` }}
                        >
                          {b.code}
                        </div>
                        <div>
                          <h3 className="font-montserrat font-bold text-white">{b.name}</h3>
                          <p className="text-white/40 text-sm">{b.desc}</p>
                        </div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col items-center gap-3">
                        <div className="bg-white p-2 rounded-xl">
                          <div className="grid grid-cols-7 gap-0.5">
                            {Array.from({ length: 49 }).map((_, i) => {
                              const corners = [0, 1, 2, 7, 8, 9, 14, 15, 16, 32, 33, 34, 39, 40, 41, 46, 47, 48];
                              const isFilled = corners.includes(i) || Math.random() > 0.55;
                              return (
                                <div
                                  key={i}
                                  className="w-3 h-3 rounded-[2px]"
                                  style={{ background: isFilled ? "#0a0e1a" : "transparent" }}
                                />
                              );
                            })}
                          </div>
                        </div>
                        <span className="text-white/40 text-xs">QR-код · {b.name}</span>
                      </div>
                      <button
                        onClick={() => setActiveBuilding(null)}
                        className="mt-4 w-full py-2 rounded-xl border border-white/10 text-white/40 text-sm hover:text-white hover:border-white/30 transition-all"
                      >
                        Закрыть
                      </button>
                    </div>
                  );
                })()
              ) : (
                <div className="rounded-3xl border border-white/10 bg-agu-card p-6 flex flex-col items-center justify-center text-center gap-4" style={{ minHeight: 200 }}>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                    <Icon name="MousePointer2" size={24} className="text-white/30" />
                  </div>
                  <div>
                    <p className="text-white/50 font-medium">Выберите корпус</p>
                    <p className="text-white/25 text-sm mt-1">Нажмите на точку на карте</p>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                {BUILDINGS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBuilding(b.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-200 text-left ${
                      activeBuilding === b.id
                        ? "border-white/20 bg-white/10"
                        : "border-white/5 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/10"
                    }`}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center font-montserrat font-bold text-white text-xs flex-shrink-0"
                      style={{ background: b.color }}
                    >
                      {b.code}
                    </div>
                    <span className="text-white/70 text-sm">{b.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INSTITUTES */}
      <section id="buildings" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-agu-orange/30 bg-agu-orange/10 text-orange-400 text-sm mb-4">
              <Icon name="Building2" size={14} />
              Институты и колледж
            </div>
            <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white mb-4">
              Академические <span className="bg-gradient-to-r from-agu-orange to-agu-cyan bg-clip-text text-transparent">подразделения</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
            {INSTITUTES.map((inst) => (
              <div
                key={inst.name}
                className="group relative rounded-3xl border border-white/10 bg-agu-card p-6 hover:border-white/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 bg-gradient-to-br ${inst.color} transition-opacity duration-300`} />
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${inst.color} flex items-center justify-center mb-4`}>
                  <Icon name={inst.icon} size={22} className="text-white" />
                </div>
                <h3 className="font-montserrat font-bold text-white text-base leading-tight mb-3">{inst.name}</h3>
                <div className="flex gap-6">
                  <div>
                    <div className="font-montserrat font-bold text-white text-xl">{inst.students}</div>
                    <div className="text-white/40 text-xs">студентов</div>
                  </div>
                  <div>
                    <div className="font-montserrat font-bold text-white text-xl">{inst.programs}</div>
                    <div className="text-white/40 text-xs">программ</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Infrastructure */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-agu-green/30 bg-agu-green/10 text-emerald-400 text-sm mb-4">
              <Icon name="Layers" size={14} />
              Инфраструктура
            </div>
            <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white mb-4">
              Объекты <span className="bg-gradient-to-r from-agu-green to-agu-cyan bg-clip-text text-transparent">кампуса</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INFRASTRUCTURE.map((inf) => (
              <div
                key={inf.name}
                className="group flex items-start gap-4 rounded-3xl border border-white/10 bg-agu-card p-5 hover:border-white/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: inf.color + "22", border: `1px solid ${inf.color}44` }}
                >
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

      {/* ABOUT */}
      <section id="about" className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-[2rem] overflow-hidden border border-white/10 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-agu-blue/30 via-agu-dark to-agu-violet/20" />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "radial-gradient(circle at 30% 50%, rgba(0,198,255,0.1) 0%, transparent 60%), radial-gradient(circle at 70% 30%, rgba(124,58,237,0.1) 0%, transparent 60%)"
              }}
            />
            <div className="relative z-10 p-8 sm:p-12 lg:p-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-white/60 text-sm mb-6">
                    <Icon name="Info" size={14} />
                    Об университете
                  </div>
                  <h2 className="font-montserrat font-black text-4xl sm:text-5xl text-white leading-none mb-6">
                    Адыгейский <br />
                    <span className="bg-gradient-to-r from-agu-cyan to-agu-violet bg-clip-text text-transparent">
                      государственный
                    </span>
                    <br />университет
                  </h2>
                  <p className="text-white/60 text-lg leading-relaxed mb-8">
                    Один из ведущих вузов Северного Кавказа, основанный в 1929 году. АГУ — крупнейший научный и образовательный центр Республики Адыгея с богатыми традициями и современной инфраструктурой.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {["Аккредитован", "Государственный", "Майкоп"].map((tag) => (
                      <span key={tag} className="px-4 py-2 rounded-full border border-white/15 text-white/60 text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: "1929", label: "Год основания", icon: "Calendar", color: "#00c6ff" },
                    { value: "6", label: "Институтов", icon: "Building2", color: "#7c3aed" },
                    { value: "12 000+", label: "Студентов", icon: "Users", color: "#00d4a0" },
                    { value: "800+", label: "Преподавателей", icon: "UserCheck", color: "#ff6b35" },
                    { value: "60+", label: "Специальностей", icon: "BookOpen", color: "#f59e0b" },
                    { value: "40", label: "Гектаров кампуса", icon: "MapPin", color: "#ec4899" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: stat.color + "22" }}
                      >
                        <Icon name={stat.icon} size={18} style={{ color: stat.color }} />
                      </div>
                      <div className="font-montserrat font-black text-white text-2xl">{stat.value}</div>
                      <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QR codes */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <h3 className="font-montserrat font-bold text-white text-xl mb-6 flex items-center gap-2">
                  <Icon name="QrCode" size={20} className="text-agu-cyan" />
                  QR-коды корпусов
                </h3>
                <div className="flex flex-wrap gap-4">
                  {QR_CODES.map((qr) => (
                    <div key={qr.name} className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-white p-1.5">
                        <div className="grid grid-cols-6 gap-0.5 w-full h-full">
                          {Array.from({ length: 36 }).map((_, i) => (
                            <div key={i} className="rounded-[1px]" style={{ background: Math.random() > 0.5 ? "#0a0e1a" : "transparent" }} />
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-white text-sm">{qr.name}</div>
                        <div className="text-white/40 text-xs mt-0.5">Сканируйте для навигации</div>
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
            <span className="font-montserrat font-bold text-white">АГУ</span>
            <span className="text-white/30 text-sm">© 2024</span>
          </div>
          <p className="text-white/30 text-sm text-center">Адыгейский государственный университет · Майкоп</p>
          <div className="flex items-center gap-3">
            <a href="#" className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
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
