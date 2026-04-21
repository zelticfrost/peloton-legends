import { INITIAL_QUESTS, MOCK_CARDS } from "../constants";
import type { SortKey, SortOrder } from "../game/collectionView";
import { RiderType, type Card, type Quest, type TradeOffer, type UserCard } from "../types";

export const STORAGE_KEY = "peloton-legends/game-state";
const STORAGE_VERSION = 1 as const;

export type ActiveTab = "COLLECTION" | "TRADING" | "TEAMS" | "HALL_OF_FAME" | "QUESTS";
export type TradingSubTab = "MARKET" | "OFFERS";

export interface PersistedGameState {
  collection: UserCard[];
  quests: Quest[];
  activeTrades: UserCard[];
  tradeOffers: TradeOffer[];
  theme: "light" | "dark";
  sortConfig: { key: SortKey; order: SortOrder };
  filter: RiderType | "ALL";
  search: string;
  activeTab: ActiveTab;
  tradingSubTab: TradingSubTab;
}

interface PersistedEnvelopeV1 extends PersistedGameState {
  version: typeof STORAGE_VERSION;
}

function cardsById(): Map<string, Card> {
  return new Map(MOCK_CARDS.map((c) => [c.id, c]));
}

export function createStarterCollection(): UserCard[] {
  return MOCK_CARDS.slice(0, 3).map((c) => ({
    ...c,
    instanceId: Math.random().toString(36),
    acquiredAt: Date.now(),
  }));
}

function sanitizeUserCard(raw: unknown, byId: Map<string, Card>): UserCard | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string") return null;
  const template = byId.get(o.id);
  if (!template) return null;
  const instanceId =
    typeof o.instanceId === "string" && o.instanceId.length > 0
      ? o.instanceId
      : Math.random().toString(36);
  const acquiredAt =
    typeof o.acquiredAt === "number" && Number.isFinite(o.acquiredAt) ? o.acquiredAt : Date.now();
  return { ...template, instanceId, acquiredAt };
}

function sanitizeUserCards(raw: unknown, byId: Map<string, Card>): UserCard[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => sanitizeUserCard(x, byId)).filter((c): c is UserCard => c !== null);
}

function mergePersistedQuests(saved: Quest[] | undefined): Quest[] {
  return INITIAL_QUESTS.map((base) => {
    const match = saved?.find((q) => q.id === base.id);
    if (!match) return { ...base };
    const current = Math.min(Math.max(0, match.current), base.target);
    const status =
      match.status === "ACTIVE" || match.status === "COMPLETED" || match.status === "CLAIMED"
        ? match.status
        : "ACTIVE";
    return { ...base, current, status };
  });
}

function sanitizeTradeOffers(raw: unknown, byId: Map<string, Card>): TradeOffer[] {
  if (!Array.isArray(raw)) return [];
  const out: TradeOffer[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const o = item as Record<string, unknown>;
    if (typeof o.id !== "string") continue;
    if (typeof o.senderId !== "string") continue;
    if (typeof o.senderName !== "string") continue;
    if (typeof o.requestedCardId !== "string" || !byId.has(o.requestedCardId)) continue;
    const offered = sanitizeUserCard(o.offeredCard, byId);
    if (!offered) continue;
    const status =
      o.status === "PENDING" || o.status === "ACCEPTED" || o.status === "REJECTED"
        ? o.status
        : "PENDING";
    out.push({
      id: o.id,
      senderId: o.senderId,
      senderName: o.senderName,
      offeredCard: offered,
      requestedCardId: o.requestedCardId,
      status,
    });
  }
  return out;
}

const ACTIVE_TABS: ActiveTab[] = ["COLLECTION", "TRADING", "TEAMS", "HALL_OF_FAME", "QUESTS"];
const TRADING_SUB: TradingSubTab[] = ["MARKET", "OFFERS"];

function sanitizeActiveTab(raw: unknown): ActiveTab {
  return typeof raw === "string" && (ACTIVE_TABS as string[]).includes(raw)
    ? (raw as ActiveTab)
    : "COLLECTION";
}

function sanitizeTradingSubTab(raw: unknown): TradingSubTab {
  return typeof raw === "string" && (TRADING_SUB as string[]).includes(raw)
    ? (raw as TradingSubTab)
    : "MARKET";
}

function sanitizeSortConfig(raw: unknown): { key: SortKey; order: SortOrder } {
  const keys: SortKey[] = ["NAME", "RARITY", "DATE", "TEAM"];
  const orders: SortOrder[] = ["ASC", "DESC"];
  if (!raw || typeof raw !== "object") return { key: "DATE", order: "DESC" };
  const o = raw as Record<string, unknown>;
  const key = keys.includes(o.key as SortKey) ? (o.key as SortKey) : "DATE";
  const order = orders.includes(o.order as SortOrder) ? (o.order as SortOrder) : "DESC";
  return { key, order };
}

function sanitizeTheme(raw: unknown): "light" | "dark" {
  return raw === "light" || raw === "dark" ? raw : "dark";
}

function sanitizeFilter(raw: unknown): RiderType | "ALL" {
  if (raw === "ALL") return "ALL";
  const values = new Set<string>(Object.values(RiderType));
  if (typeof raw === "string" && values.has(raw)) return raw as RiderType;
  return "ALL";
}

function sanitizeSearch(raw: unknown): string {
  if (typeof raw !== "string") return "";
  return raw.slice(0, 500);
}

function readStorage(key: string): string | null {
  if (typeof localStorage === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* quota or private mode */
  }
}

function parseEnvelope(raw: string): PersistedEnvelopeV1 | null {
  try {
    const data = JSON.parse(raw) as unknown;
    if (!data || typeof data !== "object") return null;
    const o = data as Record<string, unknown>;
    if (o.version !== STORAGE_VERSION) return null;
    return o as unknown as PersistedEnvelopeV1;
  } catch {
    return null;
  }
}

function loadFromDiskOrDefaults(): PersistedGameState {
  const raw = readStorage(STORAGE_KEY);
  const byId = cardsById();
  if (!raw) return createDefaultPersistedState();

  const env = parseEnvelope(raw);
  if (!env) return createDefaultPersistedState();

  let collection = sanitizeUserCards(env.collection, byId);
  if (collection.length === 0) {
    collection = createStarterCollection();
  }

  return {
    collection,
    quests: mergePersistedQuests(env.quests as Quest[] | undefined),
    activeTrades: sanitizeUserCards(env.activeTrades, byId),
    tradeOffers: sanitizeTradeOffers(env.tradeOffers, byId),
    theme: sanitizeTheme(env.theme),
    sortConfig: sanitizeSortConfig(env.sortConfig),
    filter: sanitizeFilter(env.filter),
    search: sanitizeSearch(env.search),
    activeTab: sanitizeActiveTab(env.activeTab),
    tradingSubTab: sanitizeTradingSubTab(env.tradingSubTab),
  };
}

export function createDefaultPersistedState(): PersistedGameState {
  return {
    collection: createStarterCollection(),
    quests: mergePersistedQuests(undefined),
    activeTrades: [],
    tradeOffers: [],
    theme: "dark",
    sortConfig: { key: "DATE", order: "DESC" },
    filter: "ALL",
    search: "",
    activeTab: "COLLECTION",
    tradingSubTab: "MARKET",
  };
}

function clonePersisted(s: PersistedGameState): PersistedGameState {
  return {
    ...s,
    collection: s.collection.map((c) => ({ ...c })),
    quests: s.quests.map((q) => ({ ...q })),
    activeTrades: s.activeTrades.map((c) => ({ ...c })),
    tradeOffers: s.tradeOffers.map((o) => ({
      ...o,
      offeredCard: { ...o.offeredCard },
    })),
    sortConfig: { ...s.sortConfig },
  };
}

let diskSnapshot: PersistedGameState | undefined;

export function getHydratedInitialState(): PersistedGameState {
  if (diskSnapshot === undefined) {
    diskSnapshot = loadFromDiskOrDefaults();
  }
  return clonePersisted(diskSnapshot);
}

/** Test helper: clear in-memory parse cache between Vitest cases. */
export function resetGamePersistenceCacheForTests(): void {
  diskSnapshot = undefined;
}

export function persistGameState(state: PersistedGameState): void {
  const envelope: PersistedEnvelopeV1 = {
    version: STORAGE_VERSION,
    ...state,
  };
  writeStorage(STORAGE_KEY, JSON.stringify(envelope));
}
