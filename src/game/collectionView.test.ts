import { describe, expect, it } from "vitest";
import { RiderType, Specialty } from "../types";
import type { UserCard } from "../types";
import { filterAndSortGrouped, groupCollectionByCardId } from "./collectionView";

const baseCard = (overrides: Partial<UserCard>): UserCard => ({
  id: "r1",
  name: "Rider One",
  team: "Team A",
  nationality: "Slovenia",
  type: RiderType.CLIMBER,
  specialty: Specialty.MOUNTAINS,
  stats: { climbing: 80, sprinting: 70, stamina: 75, technique: 72 },
  imageUrl: "https://example.com/1.jpg",
  rarity: "COMMON",
  description: "Test",
  year: 2024,
  instanceId: "i1",
  acquiredAt: 1000,
  ...overrides,
});

describe("groupCollectionByCardId", () => {
  it("groups duplicate ids and counts quantity", () => {
    const c1 = baseCard({ id: "a", instanceId: "x1" });
    const c2 = baseCard({ id: "a", instanceId: "x2", acquiredAt: 2000 });
    const c3 = baseCard({ id: "b", name: "Other", instanceId: "y1" });
    const grouped = groupCollectionByCardId([c1, c2, c3]);
    expect(grouped.a.quantity).toBe(2);
    expect(grouped.b.quantity).toBe(1);
    expect(grouped.a.card.instanceId).toBe("x1");
  });
});

describe("filterAndSortGrouped", () => {
  it("filters by rider type and search", () => {
    const a = baseCard({ id: "a", name: "Alpha", type: RiderType.CLIMBER, team: "UAE" });
    const b = baseCard({ id: "b", name: "Beta", type: RiderType.SPRINTER, team: "Visma" });
    const grouped = groupCollectionByCardId([a, b]);
    const onlyClimber = filterAndSortGrouped(grouped, RiderType.CLIMBER, "", {
      key: "NAME",
      order: "ASC",
    });
    expect(onlyClimber).toHaveLength(1);
    expect(onlyClimber[0].card.name).toBe("Alpha");

    const bySearch = filterAndSortGrouped(grouped, "ALL", "visma", {
      key: "NAME",
      order: "ASC",
    });
    expect(bySearch).toHaveLength(1);
    expect(bySearch[0].card.name).toBe("Beta");
  });

  it("sorts by rarity descending", () => {
    const common = baseCard({ id: "c", rarity: "COMMON", acquiredAt: 1 });
    const legendary = baseCard({ id: "l", rarity: "LEGENDARY", acquiredAt: 2 });
    const grouped = groupCollectionByCardId([common, legendary]);
    const sorted = filterAndSortGrouped(grouped, "ALL", "", {
      key: "RARITY",
      order: "DESC",
    });
    expect(sorted[0].card.rarity).toBe("LEGENDARY");
    expect(sorted[1].card.rarity).toBe("COMMON");
  });
});
