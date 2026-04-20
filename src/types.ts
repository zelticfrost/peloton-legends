export enum RiderType {
  CLIMBER = "CLIMBER",
  SPRINTER = "SPRINTER",
  TIME_TRIALIST = "TIME_TRIALIST",
  PUNCHER = "PUNCHER",
  ALL_ROUNDER = "ALL_ROUNDER",
  DOMESTIQUE = "DOMESTIQUE",
}

export enum Specialty {
  MOUNTAINS = "MOUNTAINS",
  FLAT = "FLAT",
  COBBLES = "COBBLES",
  CHRONO = "CHRONO",
  CLASSICS = "CLASSICS",
}

export interface Card {
  id: string;
  name: string;
  team: string;
  nationality: string;
  type: RiderType;
  specialty: Specialty;
  stats: {
    climbing: number;
    sprinting: number;
    stamina: number;
    technique: number;
  };
  imageUrl: string;
  rarity: "COMMON" | "UNCOMMON" | "RARE" | "LEGENDARY";
  description: string;
  year: number;
  achievements?: string[];
}

export interface UserCard extends Card {
  instanceId: string; // Unique ID for this specific copy
  acquiredAt: number;
}

export interface TradeOffer {
  id: string;
  senderId: string;
  senderName: string;
  offeredCard: UserCard;
  requestedCardId: string; // The ID of the card the sender wants
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardType: "CARD" | "PACK";
  status: "ACTIVE" | "COMPLETED" | "CLAIMED";
  icon: string; // Lucide icon name
}


