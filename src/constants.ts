import { Card, RiderType, Specialty } from "./types";

export const TEAMS = [
  "UAE Team Emirates", "Team Visma | Lease a Bike", "Alpecin-Deceuninck", 
  "Soudal Quick-Step", "Lidl-Trek", "INEOS Grenadiers", "BORA-hansgrohe",
  "Groupama-FDJ", "EF Education-EasyPost", "Movistar Team", "Bahrain Victorious",
  "Jayco AlUla", "Arkéa-B&B Hotels", "Decathlon AG2R La Mondiale", "Intermarché-Wanty"
];


const NATIONALITIES = ["Slovenia", "Denmark", "Belgium", "Netherlands", "France", "Spain", "Italy", "Great Britain", "USA", "Australia", "Colombia", "Eritrea", "Norway", "Switzerland"];

const FIRST_NAMES = ["Tadej", "Jonas", "Mathieu", "Remco", "Jasper", "Wout", "Primož", "Sepp", "Mads", "Biniam", "Tom", "Julian", "Geraint", "Enric", "Richard", "Adam", "Simon", "João", "Carlos", "Juan"];
const LAST_NAMES = ["Pogačar", "Vingegaard", "van der Poel", "Evenepoel", "Philipsen", "van Aert", "Roglič", "Kuss", "Pedersen", "Girmay", "Pidcock", "Alaphilippe", "Thomas", "Mas", "Carapaz", "Yates", "Almeida", "Rodriguez", "Ayuso", "Hindley"];

const REAL_RIDERS: Partial<Card>[] = [
  {
    name: "Tadej Pogačar",
    team: "UAE Team Emirates",
    nationality: "Slovenia",
    type: RiderType.ALL_ROUNDER,
    specialty: Specialty.MOUNTAINS,
    stats: { climbing: 99, sprinting: 85, stamina: 95, technique: 92 },
    rarity: "LEGENDARY",
    description: "The most versatile rider of his generation, dominant in both grand tours and classics.",
    achievements: ["Tour de France (2020, 2021, 2024)", "Giro d'Italia (2024)", "Liège-Bastogne-Liège (2021, 2024)", "Il Lombardia (2021, 2022, 2023)"],
  },
  {
    name: "Jonas Vingegaard",
    team: "Team Visma | Lease a Bike",
    nationality: "Denmark",
    type: RiderType.CLIMBER,
    specialty: Specialty.MOUNTAINS,
    stats: { climbing: 98, sprinting: 65, stamina: 97, technique: 88 },
    rarity: "LEGENDARY",
    description: "A pure climber with unmatched recovery and high-altitude performance.",
    achievements: ["Tour de France (2022, 2023)", "Critérium du Dauphiné (2023)", "Tour de Pologne (2024)"],
  },
  {
    name: "Remco Evenepoel",
    team: "Soudal Quick-Step",
    nationality: "Belgium",
    type: RiderType.TIME_TRIALIST,
    specialty: Specialty.CHRONO,
    stats: { climbing: 88, sprinting: 72, stamina: 94, technique: 90 },
    rarity: "LEGENDARY",
    description: "The 'Aero Bullet', world-class in time trials and a formidable grand tour contender.",
    achievements: ["Vuelta a España (2022)", "World Road Race Champion (2022)", "World Time Trial Champion (2023)", "Liège-Bastogne-Liège (2022, 2023)"],
  },
  {
    name: "Mathieu van der Poel",
    team: "Alpecin-Deceuninck",
    nationality: "Netherlands",
    type: RiderType.PUNCHER,
    specialty: Specialty.CLASSICS,
    stats: { climbing: 75, sprinting: 92, stamina: 88, technique: 99 },
    rarity: "RARE",
    description: "A master of the cobbles and explosive finishes, with incredible bike handling skills.",
    achievements: ["World Road Race Champion (2023)", "Tour of Flanders (2020, 2022, 2024)", "Paris-Roubaix (2023, 2024)", "Milan-San Remo (2023)"],
  },
  {
    name: "Wout van Aert",
    team: "Team Visma | Lease a Bike",
    nationality: "Belgium",
    type: RiderType.ALL_ROUNDER,
    specialty: Specialty.CLASSICS,
    stats: { climbing: 82, sprinting: 90, stamina: 96, technique: 98 },
    rarity: "RARE",
    description: "The ultimate all-rounder, capable of winning on any terrain from sprints to mountains.",
    achievements: ["Milan-San Remo (2020)", "Amstel Gold Race (2021)", "9x Tour de France Stage Winner", "Green Jersey Tour de France (2022)"],
  },
  {
    name: "Primož Roglič",
    team: "BORA-hansgrohe",
    nationality: "Slovenia",
    type: RiderType.ALL_ROUNDER,
    specialty: Specialty.MOUNTAINS,
    stats: { climbing: 94, sprinting: 88, stamina: 92, technique: 90 },
    rarity: "LEGENDARY",
    description: "A former ski jumper turned cycling superstar, known for his explosive uphill sprint.",
    achievements: ["Vuelta a España (2019, 2020, 2021, 2024)", "Giro d'Italia (2023)", "Liège-Bastogne-Liège (2020)", "Olympic Time Trial Champion (2020)"],
  },
  {
    name: "Jasper Philipsen",
    team: "Alpecin-Deceuninck",
    nationality: "Belgium",
    type: RiderType.SPRINTER,
    specialty: Specialty.FLAT,
    stats: { climbing: 45, sprinting: 98, stamina: 82, technique: 85 },
    rarity: "RARE",
    description: "One of the fastest men in the world, a dominant force in bunch sprints.",
  },
  {
    name: "Biniam Girmay",
    team: "Intermarché-Wanty",
    nationality: "Eritrea",
    type: RiderType.SPRINTER,
    specialty: Specialty.FLAT,
    stats: { climbing: 65, sprinting: 94, stamina: 85, technique: 88 },
    rarity: "RARE",
    description: "A history-making sprinter who excels on tough, uphill finishes.",
  },
  {
    name: "Sepp Kuss",
    team: "Team Visma | Lease a Bike",
    nationality: "USA",
    type: RiderType.CLIMBER,
    specialty: Specialty.MOUNTAINS,
    stats: { climbing: 96, sprinting: 55, stamina: 92, technique: 85 },
    rarity: "RARE",
    description: "The 'Eagle of Durango', the world's best climbing domestique turned Grand Tour winner.",
  },
  {
    name: "Mads Pedersen",
    team: "Lidl-Trek",
    nationality: "Denmark",
    type: RiderType.SPRINTER,
    specialty: Specialty.CLASSICS,
    stats: { climbing: 60, sprinting: 95, stamina: 94, technique: 92 },
    rarity: "RARE",
    description: "A powerhouse classics specialist and world-class sprinter who thrives in tough conditions.",
  },
  {
    name: "Tom Pidcock",
    team: "INEOS Grenadiers",
    nationality: "Great Britain",
    type: RiderType.PUNCHER,
    specialty: Specialty.MOUNTAINS,
    stats: { climbing: 85, sprinting: 78, stamina: 88, technique: 100 },
    rarity: "RARE",
    description: "A multi-disciplinary talent with arguably the best descending skills in the peloton.",
  },
  {
    name: "Richard Carapaz",
    team: "EF Education-EasyPost",
    nationality: "Ecuador",
    type: RiderType.CLIMBER,
    specialty: Specialty.MOUNTAINS,
    stats: { climbing: 95, sprinting: 70, stamina: 90, technique: 88 },
    rarity: "RARE",
    description: "The 'Locomotive of Carchi', an aggressive climber and Olympic champion.",
  },
  {
    name: "Adam Yates",
    team: "UAE Team Emirates",
    nationality: "Great Britain",
    type: RiderType.CLIMBER,
    specialty: Specialty.MOUNTAINS,
    stats: { climbing: 92, sprinting: 75, stamina: 88, technique: 85 },
    rarity: "RARE",
    description: "A consistent climber and key lieutenant for Pogačar, capable of winning on his own.",
  },
  {
    name: "Carlos Rodriguez",
    team: "INEOS Grenadiers",
    nationality: "Spain",
    type: RiderType.ALL_ROUNDER,
    specialty: Specialty.MOUNTAINS,
    stats: { climbing: 90, sprinting: 68, stamina: 92, technique: 86 },
    rarity: "UNCOMMON",
    description: "The future of Spanish cycling, a methodical and resilient grand tour rider.",
  },
  {
    name: "Enric Mas",
    team: "Movistar Team",
    nationality: "Spain",
    type: RiderType.CLIMBER,
    specialty: Specialty.MOUNTAINS,
    stats: { climbing: 91, sprinting: 60, stamina: 94, technique: 84 },
    rarity: "UNCOMMON",
    description: "A consistent Grand Tour podium contender known for his endurance in the high mountains.",
  },
];

const generateCards = (count: number): Card[] => {
  const cards: Card[] = [];
  
  // Add the real riders first
  REAL_RIDERS.forEach((rider, index) => {
    cards.push({
      id: (index + 1).toString(),
      name: rider.name!,
      team: rider.team!,
      nationality: rider.nationality!,
      type: rider.type!,
      specialty: rider.specialty!,
      stats: rider.stats!,
      imageUrl: `https://picsum.photos/seed/${rider.name?.replace(/\s/g, "")}/400/600`,
      rarity: rider.rarity as any || "COMMON",
      description: rider.description!,
      year: 2025,
      achievements: rider.achievements,
    });
  });

  for (let i = cards.length + 1; i <= count; i++) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const rarityRoll = Math.random();
    
    let rarity: Card["rarity"] = "COMMON";
    if (rarityRoll > 0.98) rarity = "LEGENDARY";
    else if (rarityRoll > 0.90) rarity = "RARE";
    else if (rarityRoll > 0.70) rarity = "UNCOMMON";

    const type = Object.values(RiderType)[Math.floor(Math.random() * Object.values(RiderType).length)];
    const specialty = Object.values(Specialty)[Math.floor(Math.random() * Object.values(Specialty).length)];

    cards.push({
      id: i.toString(),
      name: `${firstName} ${lastName}`,
      team: TEAMS[Math.floor(Math.random() * TEAMS.length)],
      nationality: NATIONALITIES[Math.floor(Math.random() * NATIONALITIES.length)],
      type,
      specialty,
      stats: {
        climbing: Math.floor(Math.random() * 40) + 55,
        sprinting: Math.floor(Math.random() * 40) + 55,
        stamina: Math.floor(Math.random() * 40) + 55,
        technique: Math.floor(Math.random() * 40) + 55,
      },
      imageUrl: `https://picsum.photos/seed/rider-${i}/400/600`,
      rarity,
      description: "A professional rider competing at the highest level of the World Tour.",
      year: 2025,
    });
  }

  return cards;
};

export const MOCK_CARDS = generateCards(200);

export const INITIAL_QUESTS = [
  {
    id: "q1",
    title: "Pack Opener",
    description: "Open 5 packs to get a Rare card.",
    target: 5,
    current: 0,
    rewardType: "CARD",
    status: "ACTIVE",
    icon: "Package",
  },
  {
    id: "q2",
    title: "The Collector",
    description: "Collect 10 unique riders.",
    target: 10,
    current: 0,
    rewardType: "PACK",
    status: "ACTIVE",
    icon: "LayoutGrid",
  },
  {
    id: "q3",
    title: "Master Trader",
    description: "Complete 3 trade offers.",
    target: 3,
    current: 0,
    rewardType: "CARD",
    status: "ACTIVE",
    icon: "ArrowLeftRight",
  },
  {
    id: "q4",
    title: "Legendary Hunter",
    description: "Acquire your first Legendary card.",
    target: 1,
    current: 0,
    rewardType: "PACK",
    status: "ACTIVE",
    icon: "Sparkles",
  },
] as const;


