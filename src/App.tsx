import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./components/Card";
import { MOCK_CARDS, TEAMS, INITIAL_QUESTS } from "./constants";
import { Card as CardType, RiderType, UserCard, TradeOffer, Quest } from "./types";
import { getFlagUrl } from "./lib/flags";
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  Trophy, 
  Bike, 
  ChevronRight,
  Info,
  X,
  Sparkles,
  Package,
  RefreshCcw,
  CheckCircle2,
  Lock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ArrowLeftRight,
  User,
  History,
  Target,
  Gift,
  Plus,
  Sun,
  Moon
} from "lucide-react";
import { Button, Badge, Modal, ProgressBar, Input, Select } from "./components/design-system";

type SortKey = "NAME" | "RARITY" | "DATE" | "TEAM";
type SortOrder = "ASC" | "DESC";

const RARITY_PRIORITY: Record<string, number> = {
  "COMMON": 1,
  "UNCOMMON": 2,
  "RARE": 3,
  "LEGENDARY": 4
};



export default function App() {
  const [collection, setCollection] = useState<UserCard[]>(
    MOCK_CARDS.slice(0, 3).map(c => ({ ...c, instanceId: Math.random().toString(36), acquiredAt: Date.now() }))
  );
  const [selectedCard, setSelectedCard] = useState<UserCard | null>(null);
  const [filter, setFilter] = useState<RiderType | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [newCard, setNewCard] = useState<UserCard | null>(null);
  const [activeTab, setActiveTab] = useState<"COLLECTION" | "TRADING" | "TEAMS" | "HALL_OF_FAME" | "QUESTS">("COLLECTION");
  const [tradingSubTab, setTradingSubTab] = useState<"MARKET" | "OFFERS">("MARKET");
  const [activeTrades, setActiveTrades] = useState<UserCard[]>([]);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [targetTradeCard, setTargetTradeCard] = useState<CardType | null>(null);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS as unknown as Quest[]);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; order: SortOrder }>({
    key: "DATE",
    order: "DESC"
  });
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);


  // Group collection by card ID for the grid view
  const groupedCollection = useMemo(() => collection.reduce((acc, card) => {
    if (!acc[card.id]) {
      acc[card.id] = { card, quantity: 0 };
    }
    acc[card.id].quantity += 1;
    return acc;
  }, {} as Record<string, { card: UserCard; quantity: number }>), [collection]);

  const filteredCards = useMemo(() => Object.values(groupedCollection)
    .filter(({ card }) => {
      const matchesFilter = filter === "ALL" || card.type === filter;
      const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase()) || 
                           card.team.toLowerCase().includes(search.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const cardA = (a as { card: UserCard; quantity: number }).card;
      const cardB = (b as { card: UserCard; quantity: number }).card;
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
    }), [groupedCollection, filter, search, sortConfig]);

  const updateQuestProgress = (questId: string, amount: number = 1, absolute: boolean = false) => {
    setQuests(prev => {
      const quest = prev.find(q => q.id === questId);
      if (!quest || quest.status !== "ACTIVE") return prev;

      const newCurrent = absolute ? amount : quest.current + amount;
      const finalCurrent = Math.min(newCurrent, quest.target);
      const isCompleted = finalCurrent >= quest.target;

      if (quest.current === finalCurrent && quest.status === (isCompleted ? "COMPLETED" : "ACTIVE")) {
        return prev;
      }

      return prev.map(q => {
        if (q.id === questId) {
          return {
            ...q,
            current: finalCurrent,
            status: isCompleted ? "COMPLETED" : "ACTIVE"
          };
        }
        return q;
      });
    });
  };

  const claimQuestReward = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || quest.status !== "COMPLETED") return;

    // Give reward
    if (quest.rewardType === "CARD") {
      const rareCards = MOCK_CARDS.filter(c => c.rarity === "RARE");
      const rewardCard = rareCards[Math.floor(Math.random() * rareCards.length)];
      const userCard: UserCard = {
        ...rewardCard,
        instanceId: Math.random().toString(36),
        acquiredAt: Date.now()
      };
      setCollection(prev => [...prev, userCard]);
      alert(`Quest Reward! You received ${userCard.name}`);
    } else {
      // Simulate pack opening or just give a random card
      openPack();
    }

    setQuests(prev => prev.map(q => q.id === questId ? { ...q, status: "CLAIMED" } : q));
  };

  // Update collection-based quests
  useEffect(() => {
    const uniqueRiders = Object.keys(groupedCollection).length;
    updateQuestProgress("q2", uniqueRiders, true);

    const hasLegendary = collection.some(c => c.rarity === "LEGENDARY");
    if (hasLegendary) {
      updateQuestProgress("q4", 1, true);
    }
  }, [collection, groupedCollection]);

  const openPack = () => {
    setIsOpeningPack(true);
    updateQuestProgress("q1", 1);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * MOCK_CARDS.length);
      const card = MOCK_CARDS[randomIndex];
      const userCard: UserCard = {
        ...card,
        instanceId: Math.random().toString(36),
        acquiredAt: Date.now()
      };
      setNewCard(userCard);
      setCollection(prev => [...prev, userCard]);
      setIsOpeningPack(false);
    }, 2000);
  };

  const listForTrade = (card: UserCard) => {
    // Remove one instance from collection
    const index = collection.findIndex(c => c.id === card.id);
    if (index === -1) return;
    
    const newCollection = [...collection];
    newCollection.splice(index, 1);
    
    setCollection(newCollection);
    setActiveTrades(prev => [...prev, card]);
    setSelectedCard(null);
    setActiveTab("TRADING");
    setTradingSubTab("MARKET");
  };

  const completeTrade = (tradeId: string) => {
    const tradeIndex = activeTrades.findIndex(t => t.instanceId === tradeId);
    if (tradeIndex === -1) return;

    const newActiveTrades = [...activeTrades];
    const [tradedCard] = newActiveTrades.splice(tradeIndex, 1);
    setActiveTrades(newActiveTrades);

    // Add a random new card to collection
    const missingCards = MOCK_CARDS.filter(c => !collection.find(uc => uc.id === c.id));
    const pool = missingCards.length > 0 ? missingCards : MOCK_CARDS;
    const receivedCard = pool[Math.floor(Math.random() * pool.length)];
    
    const newUserCard: UserCard = {
      ...receivedCard,
      instanceId: Math.random().toString(36),
      acquiredAt: Date.now()
    };

    setCollection(prev => [...prev, newUserCard]);
    alert(`Trade Complete! You received ${newUserCard.name}`);
  };

  const createOffer = (offeredCard: UserCard, requestedCardId: string) => {
    const newOffer: TradeOffer = {
      id: Math.random().toString(36),
      senderId: "ME",
      senderName: "You",
      offeredCard,
      requestedCardId,
      status: "PENDING"
    };
    setTradeOffers(prev => [newOffer, ...prev]);
    
    // Simulate a response after some time
    setTimeout(() => {
      setTradeOffers(current => current.map(o => 
        o.id === newOffer.id ? { ...o, status: Math.random() > 0.5 ? "ACCEPTED" : "REJECTED" } : o
      ));
    }, 5000);
  };

  const handleOfferAction = (offerId: string, action: "ACCEPT" | "REJECT") => {
    const offer = tradeOffers.find(o => o.id === offerId);
    if (!offer) return;

    if (action === "ACCEPT") {
      updateQuestProgress("q3", 1);
      // If it was an incoming offer, we give the requested card and get the offered card
      // In this simulation, let's just update status
      setTradeOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: "ACCEPTED" } : o));
      
      // If incoming:
      if (offer.senderId !== "ME") {
        const requestedCard = collection.find(c => c.id === offer.requestedCardId);
        if (requestedCard) {
          // Remove from collection
          setCollection(prev => {
            const idx = prev.findIndex(c => c.id === requestedCard.id);
            const next = [...prev];
            next.splice(idx, 1);
            return [...next, offer.offeredCard];
          });
        }
      }
    } else {
      setTradeOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: "REJECTED" } : o));
    }
  };

  // Simulate an incoming offer every now and then
  useEffect(() => {
    if (collection.length < 5) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomRider = MOCK_CARDS[Math.floor(Math.random() * MOCK_CARDS.length)];
        const myRandomRider = collection[Math.floor(Math.random() * collection.length)];
        
        const incomingOffer: TradeOffer = {
          id: Math.random().toString(36),
          senderId: "USER_" + Math.random().toString(36).slice(0, 4),
          senderName: ["LeMond89", "IndurainFan", "MerckxMagic", "PantaniPirate"][Math.floor(Math.random() * 4)],
          offeredCard: { ...randomRider, instanceId: "SIM_" + Math.random(), acquiredAt: Date.now() },
          requestedCardId: myRandomRider.id,
          status: "PENDING"
        };
        
        setTradeOffers(prev => [incomingOffer, ...prev]);
      }
    }, 30000); // Every 30 seconds check for new offer
    
    return () => clearInterval(interval);
  }, [collection]);

  const cancelTrade = (tradeId: string) => {
    const tradeIndex = activeTrades.findIndex(t => t.instanceId === tradeId);
    if (tradeIndex === -1) return;

    const newActiveTrades = [...activeTrades];
    const [cancelledCard] = newActiveTrades.splice(tradeIndex, 1);
    setActiveTrades(newActiveTrades);
    setCollection(prev => [...prev, cancelledCard]);
  };

  return (
    <div className="min-h-screen bg-bg-main text-text-primary font-sans flex flex-col">
      {/* Sidebar Navigation */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-border-subtle bg-bg-sidebar flex flex-col p-6 gap-8 hidden lg:flex">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <Trophy className="text-black w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-text-primary italic">PELOTON<br/><span className="text-brand-primary not-italic">LEGENDS</span></h1>
          </div>

          <nav className="flex flex-col gap-2">
            <NavItem 
              icon={LayoutGrid} 
              label="Collection" 
              active={activeTab === "COLLECTION"} 
              onClick={() => setActiveTab("COLLECTION")}
            />
            <NavItem 
              icon={RefreshCcw} 
              label="Trading" 
              active={activeTab === "TRADING"} 
              onClick={() => setActiveTab("TRADING")}
              badge={tradeOffers.filter(o => o.status === "PENDING" && o.senderId !== "ME").length || undefined}
            />
            <NavItem 
              icon={Bike} 
              label="Pro Teams" 
              active={activeTab === "TEAMS"}
              onClick={() => setActiveTab("TEAMS")}
            />

            <NavItem 
              icon={Trophy} 
              label="Hall of Fame" 
              active={activeTab === "HALL_OF_FAME"}
              onClick={() => setActiveTab("HALL_OF_FAME")}
            />

            <NavItem 
              icon={Target} 
              label="Quests" 
              active={activeTab === "QUESTS"}
              onClick={() => setActiveTab("QUESTS")}
              badge={quests.filter(q => q.status === "COMPLETED").length || undefined}
            />
          </nav>

          <div className="mt-auto bg-brand-primary/5 dark:bg-brand-primary/10 border border-brand-primary/10 dark:border-brand-primary/20 rounded-2xl p-4">
            <ProgressBar 
              value={Object.keys(groupedCollection).length} 
              max={MOCK_CARDS.length} 
              label="Collector Stats"
              subLabel="Unique Riders"
              variant="primary"
              size="xs"
            />
            <p className="text-[10px] text-text-secondary mt-2 italic">{collection.length} Total Cards</p>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="h-20 border-b border-border-subtle bg-bg-main/95 backdrop-blur-xl flex items-center justify-between px-8 z-40">
            <div className="flex items-center gap-4 flex-1 max-w-2xl">
              <Input 
                icon={Search}
                placeholder="Search riders, teams, nationalities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                containerClassName="flex-1"
              />
              <div className="flex items-center gap-4">
                <Select 
                  icon={Filter}
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  options={[
                    { value: "ALL", label: "All Types" },
                    ...Object.values(RiderType).map(type => ({ value: type, label: type }))
                  ]}
                />

                <div className="flex items-center gap-2 border-l border-border-subtle pl-4">
                  <Select 
                    icon={ArrowUpDown}
                    value={sortConfig.key}
                    onChange={(e) => setSortConfig(prev => ({ ...prev, key: e.target.value as SortKey }))}
                    options={[
                      { value: "DATE", label: "Date Acquired" },
                      { value: "NAME", label: "Name" },
                      { value: "RARITY", label: "Rarity" },
                      { value: "TEAM", label: "Team" }
                    ]}
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSortConfig(prev => ({ ...prev, order: prev.order === "ASC" ? "DESC" : "ASC" }))}
                    className="p-2"
                  >
                    {sortConfig.order === "ASC" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setTheme(prev => prev === "dark" ? "light" : "dark")}
                  className="w-10 h-10 rounded-xl border border-border-subtle"
                >
                  {theme === "dark" ? <Sun className="w-4 h-4 text-brand-primary" /> : <Moon className="w-4 h-4 text-text-secondary" />}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="primary" 
                leftIcon={<Package className="w-4 h-4" />}
                onClick={openPack}
                isLoading={isOpeningPack}
              >
                {isOpeningPack ? "Opening..." : "Open Pack"}
              </Button>
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 border border-border-subtle" />
            </div>
          </header>

          {/* Grid Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-7xl mx-auto">
              {activeTab === "COLLECTION" ? (
                <>
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-text-primary">2024 Collection</h2>
                    <div className="flex items-center gap-2 text-text-secondary text-sm">
                      <span>Showing {filteredCards.length} unique riders</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-16 justify-items-center">
                    <AnimatePresence mode="popLayout">
                      {filteredCards.map(({ card, quantity }) => (
                        <motion.div
                          key={card.id}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Card 
                            card={card} 
                            quantity={quantity}
                            onClick={() => setSelectedCard(card)}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </>
              ) : activeTab === "TEAMS" ? (
                <div className="space-y-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-text-primary">Pro Teams</h2>
                      <p className="text-text-secondary mt-1">Complete team rosters to unlock exclusive rewards.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {TEAMS.map(teamName => {
                      const teamRiders = MOCK_CARDS.filter(c => c.team === teamName);
                      const ownedRiders = teamRiders.filter(tr => collection.some(uc => uc.id === tr.id));
                      const progress = (ownedRiders.length / teamRiders.length) * 100;
                      
                      return (
                        <motion.div 
                          key={teamName}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-bg-card border border-border-subtle rounded-3xl p-6 hover:border-brand-primary/30 transition-all group"
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-amber-500/10 transition-colors">
                                <Bike className="w-6 h-6 text-slate-400 group-hover:text-amber-500" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-white">{teamName}</h3>
                                <p className="text-sm text-text-secondary">{teamRiders.length} Total Riders</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-black italic text-white">{Math.round(progress)}%</p>
                              <p className="text-[10px] text-text-secondary uppercase tracking-widest">Complete</p>
                            </div>
                          </div>

                          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-8">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progress}%` }}
                              className="h-full bg-amber-500"
                            />
                          </div>

                          <div className="grid grid-cols-5 gap-2">
                            {teamRiders.map(rider => {
                              const isOwned = collection.some(uc => uc.id === rider.id);
                              return (
                                <div 
                                  key={rider.id}
                                  className={`aspect-[3/4] rounded-lg border flex items-center justify-center relative overflow-hidden transition-all ${
                                    isOwned 
                                      ? "bg-amber-500/10 border-amber-500/30" 
                                      : "bg-white/5 border-white/5 grayscale opacity-40"
                                  }`}
                                  title={rider.name}
                                >
                                  {isOwned ? (
                                    <img 
                                      src={rider.imageUrl} 
                                      alt={rider.name}
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Lock className="w-4 h-4 text-text-secondary" />
                                  )}
                                  {isOwned && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent" />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : activeTab === "TRADING" ? (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-text-primary">Trading Center</h2>
                      <p className="text-text-secondary mt-1">List your duplicates or negotiate with other collectors.</p>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                      <button 
                        onClick={() => setTradingSubTab("MARKET")}
                        className={`px-6 py-2 font-bold rounded-lg text-xs transition-all ${
                          tradingSubTab === "MARKET" ? "bg-brand-primary text-black" : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        Marketplace
                      </button>
                      <button 
                        onClick={() => setTradingSubTab("OFFERS")}
                        className={`px-6 py-2 font-bold rounded-lg text-xs transition-all relative ${
                          tradingSubTab === "OFFERS" ? "bg-brand-primary text-black" : "text-text-secondary hover:text-text-primary"
                        }`}
                      >
                        My Offers
                        {tradeOffers.filter(o => o.status === "PENDING" && o.senderId !== "ME").length > 0 && (
                          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center">
                            {tradeOffers.filter(o => o.status === "PENDING" && o.senderId !== "ME").length}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {tradingSubTab === "MARKET" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      {/* Active Trades */}
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <RefreshCcw className="w-5 h-5 text-amber-500" />
                          Your Listings
                        </h3>
                        
                        {activeTrades.length === 0 ? (
                          <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl p-12 text-center">
                            <p className="text-text-secondary italic">You haven't listed any cards for trade yet.</p>
                            <Button 
                              variant="ghost"
                              onClick={() => setActiveTab("COLLECTION")}
                              className="mt-4"
                            >
                              Browse Collection
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {activeTrades.map(trade => (
                              <motion.div 
                                key={trade.instanceId}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-bg-card border border-border-subtle rounded-2xl p-4 flex items-center gap-4"
                              >
                                <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                  <img src={trade.imageUrl} alt={trade.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-white">{trade.name}</h4>
                                  <p className="text-xs text-text-secondary">{trade.team}</p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant={trade.rarity === "LEGENDARY" ? "primary" : "secondary"} size="xs">
                                      {trade.rarity}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button 
                                    variant="primary"
                                    size="sm"
                                    onClick={() => completeTrade(trade.instanceId)}
                                  >
                                    Simulate Offer
                                  </Button>
                                  <Button 
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => cancelTrade(trade.instanceId)}
                                    className="p-2"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Global Listings (Simulated) */}
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <LayoutGrid className="w-5 h-5 text-blue-500" />
                            Global Listings
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                          {MOCK_CARDS.filter(c => !collection.some(uc => uc.id === c.id)).slice(0, 4).map(card => (
                            <motion.div 
                              key={card.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-bg-card border border-border-subtle rounded-2xl p-4 flex items-center gap-4 group hover:border-white/10 transition-all"
                            >
                              <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                                <img src={card.imageUrl} alt={card.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  {getFlagUrl(card.nationality) && (
                                    <img 
                                      src={getFlagUrl(card.nationality)!} 
                                      alt="" 
                                      className="w-4 h-2.5 object-cover rounded-sm border border-white/10"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                  <h4 className="font-bold text-white">{card.name}</h4>
                                  <Badge variant={card.rarity === "LEGENDARY" ? "primary" : "outline"} size="xs">
                                    {card.rarity}
                                  </Badge>
                                </div>
                                <p className="text-xs text-text-secondary">{card.team}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <User className="w-3 h-3 text-text-secondary" />
                                  <span className="text-[10px] text-text-secondary font-medium">Listed by Collector_42</span>
                                </div>
                              </div>
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => setTargetTradeCard(card)}
                              >
                                Make Offer
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                      {/* Incoming Offers */}
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                              <ArrowLeftRight className="w-4 h-4 text-blue-500" />
                            </div>
                            Incoming Offers
                          </h3>
                          <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                            {tradeOffers.filter(o => o.senderId !== "ME" && o.status === "PENDING").length} Pending
                          </span>
                        </div>

                        <div className="space-y-4">
                          {tradeOffers.filter(o => o.senderId !== "ME").length === 0 ? (
                            <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl py-20 text-center">
                              <Package className="w-12 h-12 text-text-secondary/20 mx-auto mb-4" />
                              <p className="text-text-secondary italic">No incoming offers yet.</p>
                            </div>
                          ) : (
                            tradeOffers.filter(o => o.senderId !== "ME").map(offer => (
                              <motion.div 
                                key={offer.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-bg-card border border-border-subtle rounded-3xl p-6 relative overflow-hidden"
                              >
                                {offer.status !== "PENDING" && (
                                  <div className="absolute top-0 right-0">
                                    <Badge variant={offer.status === "ACCEPTED" ? "success" : "danger"} className="rounded-none rounded-bl-xl">
                                      {offer.status}
                                    </Badge>
                                  </div>
                                )}
                                
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full border border-white/10" />
                                  <div>
                                    <p className="text-xs font-bold text-white">{offer.senderName}</p>
                                    <p className="text-[10px] text-text-secondary uppercase tracking-widest">Pro Collector</p>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                                  <div className="flex-1 text-center">
                                    <p className="text-[10px] text-text-secondary uppercase font-bold mb-2">They Offer</p>
                                    <div className="flex flex-col items-center">
                                      <div className="w-16 h-20 rounded-lg overflow-hidden mb-2 border border-white/10">
                                        <img src={offer.offeredCard.imageUrl} alt="" className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex items-center gap-1 mt-1">
                                        {getFlagUrl(offer.offeredCard.nationality) && (
                                          <img 
                                            src={getFlagUrl(offer.offeredCard.nationality)!} 
                                            alt="" 
                                            className="w-3 h-2 object-cover rounded-[1px]"
                                            referrerPolicy="no-referrer"
                                          />
                                        )}
                                        <p className="text-xs font-bold text-white truncate w-full">{offer.offeredCard.name}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-center">
                                    <ArrowLeftRight className="w-5 h-5 text-amber-500" />
                                  </div>

                                  <div className="flex-1 text-center">
                                    <p className="text-[10px] text-text-secondary uppercase font-bold mb-2">They Want</p>
                                    <div className="flex flex-col items-center">
                                      <div className="w-16 h-20 rounded-lg overflow-hidden mb-2 border border-white/10 bg-white/5 flex items-center justify-center">
                                        {MOCK_CARDS.find(c => c.id === offer.requestedCardId) ? (
                                          <img src={MOCK_CARDS.find(c => c.id === offer.requestedCardId)?.imageUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="text-text-secondary font-bold">?</div>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1 mt-1">
                                        {MOCK_CARDS.find(c => c.id === offer.requestedCardId) && getFlagUrl(MOCK_CARDS.find(c => c.id === offer.requestedCardId)!.nationality) && (
                                          <img 
                                            src={getFlagUrl(MOCK_CARDS.find(c => c.id === offer.requestedCardId)!.nationality)!} 
                                            alt="" 
                                            className="w-3 h-2 object-cover rounded-[1px]"
                                            referrerPolicy="no-referrer"
                                          />
                                        )}
                                        <p className="text-xs font-bold text-white truncate w-full">
                                          {MOCK_CARDS.find(c => c.id === offer.requestedCardId)?.name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {offer.status === "PENDING" && (
                                  <div className="grid grid-cols-2 gap-3 mt-6">
                                    <Button 
                                      variant="success"
                                      leftIcon={<CheckCircle2 className="w-4 h-4" />}
                                      onClick={() => handleOfferAction(offer.id, "ACCEPT")}
                                    >
                                      Accept
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      onClick={() => handleOfferAction(offer.id, "REJECT")}
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                )}
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Outgoing Offers */}
                      <div className="space-y-8">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                              <History className="w-4 h-4 text-amber-500" />
                            </div>
                            Sent Offers
                          </h3>
                          <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">
                            {tradeOffers.filter(o => o.senderId === "ME" && o.status === "PENDING").length} Active
                          </span>
                        </div>

                        <div className="space-y-4">
                          {tradeOffers.filter(o => o.senderId === "ME").length === 0 ? (
                            <div className="bg-white/5 border border-white/10 border-dashed rounded-3xl py-20 text-center">
                              <History className="w-12 h-12 text-text-secondary/20 mx-auto mb-4" />
                              <p className="text-text-secondary italic">No sent offers yet.</p>
                            </div>
                          ) : (
                            tradeOffers.filter(o => o.senderId === "ME").map(offer => (
                              <motion.div 
                                key={offer.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-bg-card border border-border-subtle rounded-3xl p-6 relative overflow-hidden"
                              >
                                {offer.status !== "PENDING" && (
                                  <div className="absolute top-0 right-0">
                                    <Badge variant={offer.status === "ACCEPTED" ? "success" : "danger"} className="rounded-none rounded-bl-xl">
                                      {offer.status}
                                    </Badge>
                                  </div>
                                )}

                                <div className="flex items-center justify-between gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                                  <div className="flex-1 text-center">
                                    <p className="text-[10px] text-text-secondary uppercase font-bold mb-2">You Offer</p>
                                    <div className="flex flex-col items-center">
                                      <div className="w-16 h-20 rounded-lg overflow-hidden mb-2 border border-white/10">
                                        <img src={offer.offeredCard.imageUrl} alt="" className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex items-center gap-1 mt-1">
                                        {getFlagUrl(offer.offeredCard.nationality) && (
                                          <img 
                                            src={getFlagUrl(offer.offeredCard.nationality)!} 
                                            alt="" 
                                            className="w-3 h-2 object-cover rounded-[1px]"
                                            referrerPolicy="no-referrer"
                                          />
                                        )}
                                        <p className="text-xs font-bold text-white truncate w-full">{offer.offeredCard.name}</p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-center">
                                    <ArrowLeftRight className="w-5 h-5 text-amber-500" />
                                  </div>

                                  <div className="flex-1 text-center">
                                    <p className="text-[10px] text-text-secondary uppercase font-bold mb-2">You Want</p>
                                    <div className="flex flex-col items-center">
                                      <div className="w-16 h-20 rounded-lg overflow-hidden mb-2 border border-white/10">
                                        <img src={MOCK_CARDS.find(c => c.id === offer.requestedCardId)?.imageUrl} alt="" className="w-full h-full object-cover" />
                                      </div>
                                      <div className="flex items-center gap-1 mt-1">
                                        {MOCK_CARDS.find(c => c.id === offer.requestedCardId) && getFlagUrl(MOCK_CARDS.find(c => c.id === offer.requestedCardId)!.nationality) && (
                                          <img 
                                            src={getFlagUrl(MOCK_CARDS.find(c => c.id === offer.requestedCardId)!.nationality)!} 
                                            alt="" 
                                            className="w-3 h-2 object-cover rounded-[1px]"
                                            referrerPolicy="no-referrer"
                                          />
                                        )}
                                        <p className="text-xs font-bold text-white truncate w-full">
                                          {MOCK_CARDS.find(c => c.id === offer.requestedCardId)?.name}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === "QUESTS" ? (
                <div className="space-y-12">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-text-primary">Active Quests</h2>
                      <p className="text-text-secondary mt-1">Complete objectives to earn exclusive rewards and packs.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {quests.map(quest => {
                      const progress = (quest.current / quest.target) * 100;
                      const isClaimed = quest.status === "CLAIMED";
                      const isCompleted = quest.status === "COMPLETED";

                      return (
                        <motion.div 
                          key={quest.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`interactive-card p-6 relative overflow-hidden ${
                            isClaimed ? "opacity-50" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                                isCompleted ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-slate-400"
                              }`}>
                                {quest.icon === "Package" && <Package className="w-6 h-6" />}
                                {quest.icon === "LayoutGrid" && <LayoutGrid className="w-6 h-6" />}
                                {quest.icon === "ArrowLeftRight" && <ArrowLeftRight className="w-6 h-6" />}
                                {quest.icon === "Sparkles" && <Sparkles className="w-6 h-6" />}
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-white">{quest.title}</h3>
                                <p className="text-sm text-text-secondary">{quest.description}</p>
                              </div>
                            </div>
                            {isClaimed && (
                              <Badge variant="success">Claimed</Badge>
                            )}
                          </div>

                          <ProgressBar 
                            value={quest.current} 
                            max={quest.target} 
                            label="Progress"
                            variant={isCompleted ? "success" : "primary"}
                            size="xs"
                          />

                          <div className="mt-8 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Gift className="w-4 h-4 text-amber-500" />
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                Reward: {quest.rewardType === "CARD" ? "Rare Rider" : "New Pack"}
                              </span>
                            </div>
                            
                            {isCompleted && (
                              <Button
                                variant="success"
                                leftIcon={<Sparkles className="w-4 h-4" />}
                                onClick={() => claimQuestReward(quest.id)}
                              >
                                Claim Reward
                              </Button>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ) : activeTab === "HALL_OF_FAME" ? (
                <div className="space-y-12">
                  <div className="flex flex-col items-center text-center mb-16">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20"
                    >
                      <Trophy className="w-10 h-10 text-amber-500" />
                    </motion.div>
                    <h2 className="text-5xl font-black italic text-text-primary mb-4 tracking-tighter">HALL OF FAME</h2>
                    <p className="text-text-secondary max-w-2xl text-lg">
                      A prestigious gallery dedicated to the absolute icons of professional cycling. 
                      Only the most legendary riders earn a place in this sacred hall.
                    </p>
                  </div>

                  {Object.values(groupedCollection).filter(({ card }) => card.rarity === "LEGENDARY").length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 border-dashed rounded-[40px]">
                      <Lock className="w-12 h-12 text-text-secondary/30 mb-4" />
                      <h3 className="text-xl font-bold text-slate-400">The Hall is Currently Empty</h3>
                      <p className="text-text-secondary mt-2">Collect Legendary cards to see them honored here.</p>
                      <button 
                        onClick={openPack}
                        className="mt-8 px-8 py-3 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all"
                      >
                        Try Your Luck with a Pack
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 justify-items-center">
                      {Object.values(groupedCollection)
                        .filter(({ card }) => card.rarity === "LEGENDARY")
                        .map(({ card, quantity }) => (
                          <motion.div
                            key={card.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -10 }}
                            className="relative group"
                          >
                            <div className="absolute -inset-4 bg-amber-500/10 blur-2xl rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Card 
                              card={card} 
                              quantity={quantity}
                              onClick={() => setSelectedCard(card)}
                            />
                            <div className="mt-6 text-center">
                              <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">{card.name}</h3>
                              <p className="text-amber-500/60 text-sm font-medium uppercase tracking-widest">{card.team}</p>
                            </div>
                          </motion.div>
                        ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </main>
      </div>

      {/* Pack Opening Overlay */}
      <AnimatePresence>
        {isOpeningPack && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Background Light Bursts */}
            <motion.div 
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 90, 180, 270, 360]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute w-[800px] h-[800px] bg-gradient-conic from-amber-500/20 via-transparent to-amber-500/20 blur-3xl opacity-30"
            />

            <div className="relative">
              {/* Energy Particles */}
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [0, 1.5, 0],
                    x: Math.cos(i * 30 * Math.PI / 180) * 200,
                    y: Math.sin(i * 30 * Math.PI / 180) * 200,
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-400 rounded-full blur-[2px]"
                />
              ))}

              <motion.div
                animate={{ 
                  rotateY: [0, 15, -15, 15, 0],
                  scale: [1, 1.1, 1.05, 1.1, 1],
                  x: [0, -5, 5, -5, 5, 0],
                  y: [0, 5, -5, 5, -5, 0]
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-56 h-80 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 rounded-2xl shadow-[0_0_80px_rgba(245,158,11,0.6)] flex flex-col items-center justify-center border-4 border-white/30 relative z-10 overflow-hidden"
              >
                {/* Pack Texture/Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-white" />
                  <div className="grid grid-cols-4 gap-4 p-4">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="w-full h-8 border border-white/20 rounded-sm rotate-45" />
                    ))}
                  </div>
                </div>

                <div className="relative flex flex-col items-center gap-4">
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Package className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-black italic text-2xl tracking-tighter leading-none">PELOTON</p>
                    <p className="text-white/80 font-bold text-xs tracking-[0.3em] mt-1">LEGENDS 2024</p>
                  </div>
                </div>

                {/* Shine Effect */}
                <motion.div 
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-16 text-center"
            >
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                <Sparkles className="text-amber-500 w-8 h-8 animate-pulse" />
                Cracking Pack...
                <Sparkles className="text-amber-500 w-8 h-8 animate-pulse" />
              </h2>
              <p className="text-amber-500/60 font-mono text-sm mt-2 tracking-widest uppercase">Searching for World Tour Legends</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Card Reveal */}
      <AnimatePresence>
        {newCard && (
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewCard(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            
            {/* Rarity-specific Background Glow */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2, opacity: 0.4 }}
              className={`absolute w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none ${
                newCard.rarity === "LEGENDARY" ? "bg-amber-500" :
                newCard.rarity === "RARE" ? "bg-blue-500" :
                newCard.rarity === "UNCOMMON" ? "bg-emerald-500" : "bg-slate-500"
              }`}
            />

            <motion.div 
              initial={{ scale: 0.2, opacity: 0, rotateY: 180, rotateZ: -10 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0, rotateZ: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ 
                type: "spring", 
                damping: 12, 
                stiffness: 100,
                rotateY: { duration: 0.8, ease: "easeOut" }
              }}
              className="relative flex flex-col items-center"
            >
              <motion.div 
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -top-32 flex flex-col items-center text-center w-full"
              >
                <div className="flex items-center gap-4 mb-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                    <Sparkles className={`w-10 h-10 ${
                      newCard.rarity === "LEGENDARY" ? "text-amber-500" : "text-white/40"
                    }`} />
                  </motion.div>
                  <h2 className={`text-6xl font-black italic tracking-tighter drop-shadow-2xl ${
                    newCard.rarity === "LEGENDARY" ? "text-amber-500" : "text-white"
                  }`}>
                    {newCard.rarity === "LEGENDARY" ? "LEGENDARY REVEAL!" : "NEW RIDER!"}
                  </h2>
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                    <Sparkles className={`w-10 h-10 ${
                      newCard.rarity === "LEGENDARY" ? "text-amber-500" : "text-white/40"
                    }`} />
                  </motion.div>
                </div>
                <p className="text-white/60 font-mono tracking-[0.4em] uppercase text-sm">Official 2024 Collection</p>
              </motion.div>

              {/* Card Container with extra glow for Legendary */}
              <div className="relative group">
                {newCard.rarity === "LEGENDARY" && (
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -inset-4 bg-amber-500/20 blur-2xl rounded-[40px]"
                  />
                )}
                <Card card={newCard} />
              </div>

              <Button 
                variant={newCard.rarity === "LEGENDARY" ? "primary" : "secondary"}
                size="lg"
                className="mt-16 px-12 py-4 text-lg"
                onClick={() => setNewCard(null)}
              >
                Add to Collection
              </Button>
            </motion.div>

            {/* Confetti-like particles for Legendary */}
            {newCard.rarity === "LEGENDARY" && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(30)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      top: "50%", 
                      left: "50%", 
                      opacity: 1,
                      scale: Math.random() * 0.5 + 0.5,
                      rotate: 0
                    }}
                    animate={{ 
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      opacity: 0,
                      rotate: Math.random() * 360,
                    }}
                    transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                    className="absolute w-2 h-6 bg-amber-400 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        size="lg"
        className="!p-0"
      >
        {selectedCard && (
          <div className="flex flex-col md:flex-row h-full">
            <div className="md:w-1/2 p-8 flex justify-center bg-slate-100 dark:bg-black/20 items-center">
              <Card card={selectedCard} quantity={groupedCollection[selectedCard.id]?.quantity} />
            </div>

            <div className="md:w-1/2 p-10 flex flex-col">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={selectedCard.rarity === "LEGENDARY" ? "primary" : "secondary"}>
                    {selectedCard.rarity}
                  </Badge>
                  <Badge variant="outline">
                    {selectedCard.type}
                  </Badge>
                </div>
                <h2 className="text-4xl font-bold text-text-primary mb-2">{selectedCard.name}</h2>
                <p className="text-brand-primary font-medium tracking-wide">{selectedCard.team}</p>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info className="w-3 h-3" /> Rider Profile
                  </h4>
                  <p className="text-text-secondary leading-relaxed italic">
                    "{selectedCard.description}"
                  </p>
                </div>

                {selectedCard.achievements && selectedCard.achievements.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Trophy className="w-3 h-3 text-amber-500" /> Career Highlights
                    </h4>
                    <ul className="space-y-2">
                      {selectedCard.achievements.map((achievement, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Nationality</h4>
                    <div className="flex items-center gap-2">
                      {getFlagUrl(selectedCard.nationality) && (
                        <img 
                          src={getFlagUrl(selectedCard.nationality)!} 
                          alt="" 
                          className="w-5 h-3.5 object-cover rounded-sm border border-border-subtle"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <p className="text-text-primary font-medium">{selectedCard.nationality}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Specialty</h4>
                    <p className="text-text-primary font-medium">{selectedCard.specialty}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Button variant="outline" className="flex-1" leftIcon={<Plus className="w-4 h-4" />}>
                  Add to Favorites
                </Button>
                {groupedCollection[selectedCard.id]?.quantity > 1 && (
                  <Button 
                    variant="primary"
                    className="flex-1"
                    leftIcon={<RefreshCcw className="w-4 h-4" />}
                    onClick={() => listForTrade(selectedCard)}
                  >
                    List for Trade
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Trade Selection Modal */}
      <Modal
        isOpen={!!targetTradeCard}
        onClose={() => setTargetTradeCard(null)}
        title="Create Trade Offer"
        size="lg"
      >
        {targetTradeCard && (
          <div className="space-y-8">
            <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="flex-1 text-center">
                <p className="text-[10px] text-text-secondary uppercase font-bold mb-3">You Want</p>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-32 rounded-xl overflow-hidden mb-3 border-2 border-amber-500/50 shadow-lg shadow-amber-500/10">
                    <img src={targetTradeCard.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    {getFlagUrl(targetTradeCard.nationality) && (
                      <img 
                        src={getFlagUrl(targetTradeCard.nationality)!} 
                        alt="" 
                        className="w-4 h-2.5 object-cover rounded-sm border border-white/10"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <p className="text-sm font-bold text-white">{targetTradeCard.name}</p>
                  </div>
                  <Badge variant={targetTradeCard.rarity === "LEGENDARY" ? "primary" : "outline"} size="xs" className="mt-1">
                    {targetTradeCard.rarity}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col items-center px-8">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <ArrowLeftRight className="w-6 h-6 text-black" />
                </div>
              </div>

              <div className="flex-1 text-center">
                <p className="text-[10px] text-text-secondary uppercase font-bold mb-3">You Give</p>
                <div className="flex flex-col items-center">
                  <div className="w-24 h-32 rounded-xl border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center mb-3">
                    <Plus className="w-8 h-8 text-text-secondary" />
                  </div>
                  <p className="text-sm font-bold text-text-secondary italic">Select a card</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <RefreshCcw className="w-4 h-4 text-amber-500" />
                  Select from your duplicates
                </h4>
                <span className="text-[10px] text-text-secondary uppercase font-bold">
                  {collection.filter(c => groupedCollection[c.id].quantity > 1).length} Available
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {collection.filter(c => groupedCollection[c.id].quantity > 1)
                  .filter((c, i, self) => self.findIndex(t => t.id === c.id) === i) // Unique IDs
                  .map(card => (
                  <motion.div
                    key={card.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      createOffer(card, targetTradeCard.id);
                      setTargetTradeCard(null);
                      setTradingSubTab("OFFERS");
                      alert(`Offer sent! You offered ${card.name} for ${targetTradeCard.name}.`);
                    }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-3 cursor-pointer hover:bg-white/10 hover:border-amber-500/30 transition-all group"
                  >
                    <div className="aspect-[3/4] rounded-lg overflow-hidden mb-2 relative">
                      <img src={card.imageUrl} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-1 right-1 bg-amber-500 text-black text-[10px] font-black px-1.5 py-0.5 rounded shadow-lg">
                        x{groupedCollection[card.id].quantity}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {getFlagUrl(card.nationality) && (
                        <img 
                          src={getFlagUrl(card.nationality)!} 
                          alt="" 
                          className="w-3 h-2 object-cover rounded-[1px]"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <p className="text-[10px] font-bold text-white truncate">{card.name}</p>
                    </div>
                    <p className="text-[8px] text-text-secondary uppercase">{card.rarity}</p>
                  </motion.div>
                ))}

                {collection.filter(c => groupedCollection[c.id].quantity > 1).length === 0 && (
                  <div className="col-span-full py-12 text-center bg-white/5 rounded-2xl border border-white/10 border-dashed">
                    <p className="text-text-secondary text-sm italic">You don't have any duplicate cards to trade.</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => {
                        setTargetTradeCard(null);
                        setActiveTab("COLLECTION");
                      }}
                    >
                      Get more packs
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function NavItem({ icon: Icon, label, active = false, onClick, badge }: { icon: any, label: string, active?: boolean, onClick?: () => void, badge?: number }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all w-full text-left group ${
        active ? "bg-brand-primary text-black font-bold shadow-lg shadow-brand-primary/20" : "text-text-secondary hover:text-text-primary hover:bg-slate-100 dark:hover:bg-white/5"
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? "text-black" : "text-text-secondary group-hover:text-brand-primary"} transition-colors`} />
      <span className="text-sm">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
          active ? "bg-black text-brand-primary" : "bg-brand-primary text-black shadow-lg shadow-brand-primary/40"
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}




