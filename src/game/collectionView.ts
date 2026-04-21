import type { RiderType, UserCard } from "../types";

export type SortKey = "NAME" | "RARITY" | "DATE" | "TEAM";
export type SortOrder = "ASC" | "DESC";

export const RARITY_PRIORITY: Record<string, number> = {
  COMMON: 1,
  UNCOMMON: 2,
  RARE: 3,
  LEGENDARY: 4,
};

export type GroupedEntry = { card: UserCard; quantity: number };

export function groupCollectionByCardId(
  collection: UserCard[],
): Record<string, GroupedEntry> {
  return collection.reduce(
    (acc, card) => {
      if (!acc[card.id]) {
        acc[card.id] = { card, quantity: 0 };
      }
      acc[card.id].quantity += 1;
      return acc;
    },
    {} as Record<string, GroupedEntry>,
  );
}

export function filterAndSortGrouped(
  grouped: Record<string, GroupedEntry>,
  filter: RiderType | "ALL",
  search: string,
  sortConfig: { key: SortKey; order: SortOrder },
): GroupedEntry[] {
  const q = search.toLowerCase();
  return Object.values(grouped)
    .filter(({ card }) => {
      const matchesFilter = filter === "ALL" || card.type === filter;
      const matchesSearch =
        card.name.toLowerCase().includes(q) || card.team.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const cardA = a.card;
      const cardB = b.card;
      let comparison = 0;

      switch (sortConfig.key) {
        case "NAME":
          comparison = cardA.name.localeCompare(cardB.name);
          break;
        case "RARITY":
          comparison = RARITY_PRIORITY[cardA.rarity] - RARITY_PRIORITY[cardB.rarity];
          break;
        case "DATE":
          comparison = cardA.acquiredAt - cardB.acquiredAt;
          break;
        case "TEAM":
          comparison = cardA.team.localeCompare(cardB.team);
          break;
      }

      return sortConfig.order === "ASC" ? comparison : -comparison;
    });
}
