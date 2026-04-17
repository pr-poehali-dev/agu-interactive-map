export interface Building {
  id: string;
  code: string;
  name: string;
  fullName: string;
  address: string;
  lat: number;
  lng: number;
  color: string;
  desc: string;
  units: string[];
  photo?: string;
  qrCode?: string;
  hasQR: boolean;
  isSpecial?: boolean;
}

export interface Institute {
  name: string;
  shortName: string;
  icon: string;
  color: string;
  building: string;
}

export interface InfraItem {
  name: string;
  desc: string;
  icon: string;
  color: string;
  address?: string;
  hasQR?: boolean;
  qrCode?: string;
}

export const BUILDINGS: Building[] = [
  {
    id: "M",
    code: "М",
    name: "Главный корпус М",
    fullName: "Главный корпус М",
    address: "пр. Ленина, 61",
    lat: 53.3462,
    lng: 83.7786,
    color: "#00c6ff",
    desc: "Главный корпус университета. ИНГЕО, ИИМО, ректорат, центральный вход.",
    units: ["ИНГЕО", "ИИМО"],
    hasQR: true,
  },
  {
    id: "L",
    code: "Л",
    name: "Корпус Л",
    fullName: "Корпус Л",
    address: "пр. Ленина, 61",
    lat: 53.3468,
    lng: 83.7792,
    color: "#7c3aed",
    desc: "ИББ, ИМИТ, библиотека, учебные лаборатории.",
    units: ["ИББ", "ИМИТ", "Библиотека"],
    hasQR: true,
  },
  {
    id: "S",
    code: "С",
    name: "Корпус С",
    fullName: "Корпус С",
    address: "пр. Социалистический, 68",
    lat: 53.3401,
    lng: 83.7715,
    color: "#00d4a0",
    desc: "МИЭМИС, Юридический институт, деканаты, Центр Творчества, Точка кипения, Лига студентов.",
    units: ["МИЭМИС", "Юридический институт", "Деканат очная форма", "Деканат заочная форма", "Центр Творчества", "Точка кипения", "Лига студентов"],
    hasQR: false,
    isSpecial: true,
  },
  {
    id: "D",
    code: "Д",
    name: "Корпус Д",
    fullName: "Корпус Д",
    address: "ул. Димитрова, 66",
    lat: 53.3560,
    lng: 83.7650,
    color: "#ff6b35",
    desc: "ИГН, Медиа.Хаб.",
    units: ["ИГН", "Медиа.Хаб"],
    hasQR: true,
  },
  {
    id: "K",
    code: "К",
    name: "Корпус К",
    fullName: "Корпус К",
    address: "пр. Красноармейский, 90",
    lat: 53.3310,
    lng: 83.7540,
    color: "#f59e0b",
    desc: "ИХиХФТ, ИЦТЭФ, химические и технические лаборатории.",
    units: ["ИХиХФТ", "ИЦТЭФ"],
    hasQR: true,
  },
  {
    id: "SOK",
    code: "СОК",
    name: "СОК",
    fullName: "Спортивно-оздоровительный комплекс",
    address: "пр. Красноармейский, 90а",
    lat: 53.3305,
    lng: 83.7548,
    color: "#ec4899",
    desc: "Спортивно-оздоровительный комплекс. Тренажёрные залы, спортивные секции, соревнования.",
    units: ["Спортивные секции", "Тренажёрный зал"],
    hasQR: false,
  },
];

export const INSTITUTES: Institute[] = [
  { name: "Институт математики и информационных технологий", shortName: "ИМИТ", icon: "Calculator", color: "from-blue-600 to-cyan-500", building: "Л" },
  { name: "Институт биологии и биотехнологии", shortName: "ИББ", icon: "Dna", color: "from-emerald-600 to-teal-500", building: "Л" },
  { name: "Институт географии и природопользования", shortName: "ИНГЕО", icon: "Globe", color: "from-green-600 to-emerald-500", building: "М" },
  { name: "Институт истории и международных отношений", shortName: "ИИМО", icon: "Landmark", color: "from-amber-600 to-yellow-500", building: "М" },
  { name: "Институт гуманитарных наук", shortName: "ИГН", icon: "BookOpen", color: "from-orange-600 to-amber-500", building: "Д" },
  { name: "Институт химии и химико-фармацевтических технологий", shortName: "ИХиХФТ", icon: "FlaskConical", color: "from-pink-600 to-rose-500", building: "К" },
  { name: "Институт цифровых технологий, электроники и физики", shortName: "ИЦТЭФ", icon: "Cpu", color: "from-violet-600 to-purple-500", building: "К" },
  { name: "Институт экономики, менеджмента и информационных систем", shortName: "МИЭМИС", icon: "TrendingUp", color: "from-indigo-600 to-blue-500", building: "С" },
  { name: "Юридический институт", shortName: "Юридический", icon: "Scale", color: "from-slate-600 to-gray-500", building: "С" },
];

export const INFRA_ITEMS: InfraItem[] = [
  { name: "Библиотека", desc: "Научная библиотека АлтГУ в корпусе Л, более 1 млн изданий", icon: "Library", color: "#00c6ff" },
  { name: "СОК", desc: "Спортивно-оздоровительный комплекс: тренажёрные залы, секции. пр. Красноармейский, 90а", icon: "Dumbbell", color: "#00d4a0" },
  { name: "Студенческая поликлиника", desc: "Медицинская помощь студентам и сотрудникам. ул. Юрина, 166а", icon: "HeartPulse", color: "#ff6b35" },
  { name: "Медиа.Хаб", desc: "Медиацентр университета, студия записи и съёмки. Корпус Д", icon: "Video", color: "#7c3aed" },
  { name: "Точка кипения", desc: "Коворкинг, мероприятия, стартапы. Корпус С", icon: "Zap", color: "#f59e0b" },
  { name: "Центр Творчества", desc: "Творческие объединения, клубы, студии. Корпус С", icon: "Palette", color: "#ec4899" },
  { name: "Лига студентов", desc: "Студенческое самоуправление. Корпус С", icon: "Users", color: "#00c6ff" },
  {
    name: "Колледж АлтГУ",
    desc: "Среднее профессиональное образование на базе Алтайского государственного университета",
    icon: "GraduationCap",
    color: "#10b981",
    hasQR: true,
  },
];

export const S_COMMUNITIES = [
  { name: "МИЭМИС", icon: "TrendingUp", color: "#00c6ff" },
  { name: "Юридический институт", icon: "Scale", color: "#7c3aed" },
  { name: "Деканат очная форма", icon: "UserCheck", color: "#00d4a0" },
  { name: "Деканат заочная форма", icon: "BookOpen", color: "#ff6b35" },
  { name: "Центр Творчества", icon: "Palette", color: "#f59e0b" },
  { name: "Точка кипения", icon: "Zap", color: "#ec4899" },
  { name: "Лига студентов", icon: "Users", color: "#10b981" },
];
