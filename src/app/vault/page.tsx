"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Grid3X3, Search, Box } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "storymint_nfts";
const EMPTY_IMG = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/72578d18-4c28-4032-9a62-d9e4e894b6b4/generated_images/cozy-storybook-shelf-with-empty-frames-a-ec4fd90a-20250927092458.jpg?";

const SAMPLE_NFTS = [
  {
    id: "sample-1",
    name: "Aurora Voyager",
    image:
      "https://images.unsplash.com/photo-1521120413309-4c882b41a803?auto=format&fit=crop&w=800&q=80",
    description: "A luminous traveler collecting stories from the World Chain galaxy.",
    txHash: "0xsampler111",
    owner: "0xsampler",
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    collection: "World Chain Originals",
  },
  {
    id: "sample-2",
    name: "Neon Chronicle",
    image:
      "https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=800&q=80",
    description: "An evolving ledger of memories rendered in iridescent light.",
    txHash: "0xsampler222",
    owner: "0xsampler",
    timestamp: Date.now() - 1000 * 60 * 30,
    collection: "World Chain Originals",
  },
  {
    id: "sample-3",
    name: "Celestial Sojourner",
    image:
      "https://images.unsplash.com/photo-1516110833967-57885a279c8b?auto=format&fit=crop&w=800&q=80",
    description: "A guardian spirit mapping constellations of on-chain lore.",
    txHash: "0xsampler333",
    owner: "0xsampler",
    timestamp: Date.now() - 1000 * 60 * 5,
    collection: "Starfall Archives",
  },
];

function VaultContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [account, setAccount] = useState<string | null>(null);
  const [walletInput, setWalletInput] = useState("");

  useEffect(() => {
    // load NFTs
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const all = raw ? (JSON.parse(raw) as any[]) : [];
      setItems(all);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    const anyWindow = window as any;
    async function getAcc() {
      if (!anyWindow?.ethereum?.request) return;
      try {
        const accs: string[] = await anyWindow.ethereum.request({ method: "eth_accounts" });
        if (accs && accs.length > 0) setAccount(accs[0]);
      } catch {}
    }
    getAcc();
  }, []);

  const filtered = useMemo(() => {
    if (!account) {
      // show guest mints if no wallet
      return items.filter((i) => i.owner === "guest");
    }
    return items.filter((i) => i.owner?.toLowerCase() === account.toLowerCase());
  }, [items, account]);

  const stats = useMemo(() => {
    const total = filtered.length;
    const collections = new Set(
      filtered.map((item) => (item.collection ?? item.collectionName ?? "Uncategorized"))
    );
    const lastUpdatedTimestamp = filtered.reduce(
      (latest, item) => Math.max(latest, Number(item.timestamp) || 0),
      0
    );
    return {
      total,
      collections: total ? collections.size : 0,
      lastUpdated: lastUpdatedTimestamp
        ? new Date(lastUpdatedTimestamp).toLocaleString()
        : "—",
    };
  }, [filtered]);

  useEffect(() => {
    if (params.get("justMinted") === "1") {
      toast.success("Hooray! Your first NFT is here.");
    }
  }, [params]);

  const handleLoadWallet = () => {
    const trimmed = walletInput.trim();
    if (!trimmed) {
      toast.error("Enter a wallet address to load NFTs.");
      return;
    }
    setAccount(trimmed);
    toast.success("Wallet connected.");
  };

  const handleUseSample = () => {
    setItems(SAMPLE_NFTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_NFTS));
    setAccount("0xsampler");
    setWalletInput("0xsampler");
    toast.success("Loaded sample World Chain NFTs.");
  };

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-[#080b1c] via-[#0b0f27] to-[#050713] text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10 sm:py-14">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur">
              <Grid3X3 className="size-5 text-white/80" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-white/40">Dashboard</p>
              <h1 className="text-lg font-semibold text-white">NFT.E</h1>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-10 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10"
            aria-label="Search NFTs"
          >
            <Search className="size-5" />
          </Button>
        </header>

        <Card className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_40px_120px_rgba(8,11,28,0.55)] backdrop-blur-xl sm:p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">Your NFT Collection</h2>
              <p className="mt-2 text-sm text-white/60 sm:text-base">
                Explore and manage your World Chain NFTs
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 sm:p-5">
              <label className="text-xs uppercase tracking-[0.28em] text-white/40">World Chain wallet address</label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  value={walletInput}
                  onChange={(event) => setWalletInput(event.target.value)}
                  placeholder="0x..."
                  className="h-11 flex-1 rounded-xl border-white/10 bg-black/40 text-white placeholder:text-white/30"
                />
                <div className="flex w-full gap-3 sm:w-auto">
                  <Button
                    onClick={handleUseSample}
                    className="flex-1 rounded-xl bg-white text-black hover:bg-white/90 sm:flex-none"
                  >
                    Use sample
                  </Button>
                  <Button
                    onClick={handleLoadWallet}
                    disabled={!walletInput.trim()}
                    className={cn(
                      "flex-1 rounded-xl border border-white/10 bg-white/10 text-white/70 hover:bg-white/20",
                      !walletInput.trim() && "cursor-not-allowed opacity-60"
                    )}
                  >
                    Load NFTs
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 sm:grid-cols-3">
              {[{ label: "Total NFTs", value: stats.total }, { label: "Collections", value: stats.collections }, { label: "Last Updated", value: stats.lastUpdated }].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/30">{stat.label}</p>
                  <p className="text-lg font-semibold text-white sm:text-xl">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid place-items-center gap-3 py-10 text-center text-white/70">
              <div className="grid size-16 place-items-center rounded-full border border-white/10 bg-white/5">
                <Box className="size-7" />
              </div>
              {filtered.length === 0 ? (
                <>
                  <h3 className="text-lg font-medium text-white sm:text-xl">Connect your wallet</h3>
                  <p className="max-w-sm text-sm text-white/60">
                    Connect your wallet to explore your World Chain NFT collection, or check back later
                    as you acquire new NFTs.
                  </p>
                  <Button
                    variant="secondary"
                    className="rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20"
                    onClick={() => router.push("/#mint")}
                  >
                    Mint your first NFT
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-white sm:text-xl">{account ? `Wallet: ${account}` : "Guest collection"}</h3>
                  <p className="max-w-sm text-sm text-white/60">
                    Keep exploring World Chain drops, and return here to see your collection grow in real time.
                  </p>
                </>
              )}
            </div>
          </div>
        </Card>

        {filtered.length > 0 ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-white">Your NFTs</h4>
              <Button
                variant="ghost"
                className="rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
                onClick={() => router.push("/#mint")}
              >
                Mint more
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((nft) => (
                <div
                  key={nft.id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_30px_60px_rgba(5,7,19,0.45)] transition hover:translate-y-[-2px] hover:bg-white/[0.06]"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm uppercase tracking-[0.28em] text-white/40">
                          {nft.collection ?? nft.collectionName ?? "Collection"}
                        </p>
                        <h5 className="text-lg font-semibold text-white">{nft.name}</h5>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/70">
                        {nft.owner === "guest"
                          ? "Guest"
                          : `${nft.owner?.slice(0, 4)}...${nft.owner?.slice(-4)}`}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 p-5 text-sm text-white/70">
                    <p>{nft.description}</p>
                    <div className="flex items-center justify-between text-xs text-white/40">
                      <span>Minted</span>
                      <span>
                        {nft.timestamp
                          ? new Date(nft.timestamp).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="mx-auto flex max-w-md flex-col items-center gap-6 text-center text-white/70">
            <img src={EMPTY_IMG} alt="Empty shelf" className="w-full rounded-3xl border border-white/10" />
            <p>No NFTs yet — mint your first friend and it will appear here.</p>
          </section>
        )}
      </div>
    </main>
  );
}

function VaultLoading() {
  return (
    <main className="min-h-[calc(100dvh-64px)]">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>Your NFT Vault</h1>
          <p className="text-muted-foreground" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
            Loading your magical collection...
          </p>
        </div>
      </section>
    </main>
  );
}

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

export default function VaultPage() {
  return (
    <Suspense fallback={<VaultLoading />}>
      <VaultContent />
    </Suspense>
  );
}