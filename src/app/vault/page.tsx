"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Box, Grid3X3, Loader2 } from "lucide-react";

const STORAGE_KEY = "storymint_nfts";

type ExplorerNFT = {
  id: string;
  name: string;
  image: string;
  description?: string;
  txHash?: string;
  owner: string;
  timestamp: number;
  collection?: string;
};

type SortKey = "recent" | "oldest" | "name";

async function fetchWalletNfts(address: string | null): Promise<ExplorerNFT[]> {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const stored = raw ? (JSON.parse(raw) as ExplorerNFT[]) : [];
    if (!address) {
      return stored.filter((item) => (item.owner ?? "").toLowerCase() === "guest");
    }
    const normalized = address.toLowerCase();
    return stored.filter((item) => (item.owner ?? "").toLowerCase() === normalized);
  } catch (error) {
    console.error("Failed to read local NFTs", error);
    return [];
  }
}

function formatWalletLabel(address: string | null) {
  if (!address) return "Guest session (local mints)";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function VaultContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [account, setAccount] = useState<string | null>(null);
  const [nfts, setNfts] = useState<ExplorerNFT[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("recent");

  const loadNfts = useCallback(async (address: string | null) => {
    setIsLoading(true);
    try {
      // When the World Chain MiniKit is wired in, replace this call with the remote fetcher.
      const data = await fetchWalletNfts(address);
      setNfts(data);
    } catch (error) {
      console.error("Unable to load NFTs", error);
      toast.error("We couldn\'t load your NFTs. Please try again.");
      setNfts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const queryFlag = params.get("justMinted");
    if (queryFlag === "1") {
      toast.success("Your mint has been added to the Explorer.");
      loadNfts(account);
    }
  }, [account, loadNfts, params]);

  useEffect(() => {
    loadNfts(account);
  }, [account, loadNfts]);

  useEffect(() => {
    const anyWindow = window as any;
    async function detectExisting() {
      if (!anyWindow?.ethereum?.request) {
        await loadNfts(null);
        return;
      }
      try {
        const accs: string[] = await anyWindow.ethereum.request({ method: "eth_accounts" });
        if (accs && accs.length > 0) {
          setAccount(accs[0]);
        } else {
          await loadNfts(null);
        }
      } catch (error) {
        console.error("Wallet detection failed", error);
        await loadNfts(null);
      }
    }
    void detectExisting();
  }, [loadNfts]);

  const connectWallet = useCallback(async () => {
    const anyWindow = window as any;
    if (!anyWindow?.ethereum?.request) {
      toast.info("No compatible wallet found. World ID connection will be available soon.");
      return;
    }
    setIsConnecting(true);
    try {
      const accounts: string[] = await anyWindow.ethereum.request({ method: "eth_requestAccounts" });
      if (!accounts?.length) {
        toast.info("Wallet connection was closed.");
        return;
      }
      const primary = accounts[0];
      setAccount(primary);
      toast.success("Wallet connected");
    } catch (error) {
      console.error("Wallet connection failed", error);
      toast.error("Could not connect the wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const refreshNfts = useCallback(async () => {
    await loadNfts(account);
    toast.success("Explorer refreshed");
  }, [account, loadNfts]);

  const disconnectWallet = useCallback(async () => {
    setAccount(null);
    await loadNfts(null);
    toast.info("Disconnected. Showing guest session mints.");
  }, [loadNfts]);

  const sortedNfts = useMemo(() => {
    const data = [...nfts];
    switch (sortKey) {
      case "name":
        return data.sort((a, b) => a.name.localeCompare(b.name));
      case "oldest":
        return data.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
      case "recent":
      default:
        return data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }
  }, [nfts, sortKey]);

  const stats = useMemo(() => {
    const total = nfts.length;
    const collections = new Set(
      nfts.map((item) => item.collection || "Uncategorized")
    );
    const lastTimestamp = nfts.reduce(
      (acc, item) => Math.max(acc, Number(item.timestamp) || 0),
      0
    );
    return {
      total,
      collections: collections.size,
      lastUpdated: lastTimestamp ? new Date(lastTimestamp).toLocaleString() : "—",
    };
  }, [nfts]);

  const hasResults = sortedNfts.length > 0;

  return (
    <main className="min-h-[100dvh] pb-16 pt-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-sky-100/60 bg-white/70 shadow-sm">
              <Grid3X3 className="h-5 w-5 text-sky-700" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-sky-600/70" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                Explorer
              </p>
              <h1 className="text-3xl text-slate-900" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
                Nexplorer Vault
              </h1>
            </div>
          </div>
        </header>

        <Card className="rounded-3xl border border-sky-100/70 bg-white/85 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-sky-600/80" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  Connected wallet
                </p>
                <h2 className="mt-1 text-2xl text-slate-900" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
                  {formatWalletLabel(account)}
                </h2>
                <p className="mt-1 text-sm text-slate-600" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  NFTs load automatically after a successful World ID / wallet connection. You can refresh anytime as you integrate the World Chain MiniKit.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {account ? (
                  <Button
                    variant="secondary"
                    className="rounded-full border border-sky-200 bg-sky-50 px-5 text-sky-800 hover:bg-sky-100"
                    style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}
                    onClick={disconnectWallet}
                  >
                    Disconnect
                  </Button>
                ) : null}
                <Button
                  className="rounded-full bg-yellow-400 px-6 text-slate-900 hover:bg-yellow-300"
                  style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}
                  onClick={account ? refreshNfts : connectWallet}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Connecting
                    </span>
                  ) : account ? (
                    "Refresh NFTs"
                  ) : (
                    "Connect wallet"
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-sky-100/70 bg-white/70 p-4">
              <div className="flex flex-col gap-4 sm:grid sm:grid-cols-3">
                {[{ label: "Total NFTs", value: stats.total }, { label: "Collections", value: stats.collections }, { label: "Last updated", value: stats.lastUpdated }].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                  <p className="text-[0.65rem] uppercase tracking-[0.24em] text-slate-500" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                    {stat.label}
                  </p>
                  <p className="text-base font-semibold leading-tight text-slate-900" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                    {stat.value}
                  </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-sky-100/70 bg-sky-50/70 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-700" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  Choose how you want your collection sorted. Additional filters can plug into this panel when on-chain metadata is available.
                </p>
              </div>
              <Select value={sortKey} onValueChange={(value) => setSortKey(value as SortKey)}>
                <SelectTrigger className="w-52 rounded-xl border border-sky-200 bg-white text-slate-700" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-sky-200 bg-white text-slate-700">
                  <SelectItem value="recent">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="name">Name A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <section className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl text-slate-900" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
                {hasResults ? "Explorer results" : "No NFTs yet"}
              </h3>
              <p className="text-sm text-slate-600" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                {hasResults
                  ? "These entries update automatically once the World Chain MiniKit fetch is wired in."
                  : "Connect your wallet or mint a buddy to populate the Explorer."}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-72 animate-pulse rounded-3xl border border-sky-100/60 bg-white/60"
                />
              ))}
            </div>
          ) : hasResults ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sortedNfts.map((nft) => (
                <Card
                  key={nft.id}
                  className="group overflow-hidden rounded-3xl border border-sky-100/70 bg-white/80 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <img
                      src={nft.image}
                      alt={nft.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-white to-transparent/40 py-4 px-5">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-600" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                        {nft.collection || "Collection"}
                      </p>
                      <h4 className="text-lg text-slate-900" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
                        {nft.name}
                      </h4>
                    </div>
                  </div>
                  <div className="space-y-4 p-5 text-sm text-slate-600" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                    {nft.description ? <p>{nft.description}</p> : null}
                    <div className="grid gap-2 text-xs text-slate-500">
                      <div className="flex items-center justify-between">
                        <span>Owner</span>
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-slate-700">
                          {nft.owner === "guest" ? "Guest" : formatWalletLabel(nft.owner)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Minted</span>
                        <span>{nft.timestamp ? new Date(nft.timestamp).toLocaleString() : "Unknown"}</span>
                      </div>
                      {nft.txHash ? (
                        <div className="flex items-center justify-between">
                          <span>Tx</span>
                          <span className="truncate" title={nft.txHash}>
                            {`${nft.txHash.slice(0, 6)}...${nft.txHash.slice(-4)}`}
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="mx-auto flex max-w-md flex-col items-center gap-6 rounded-3xl border border-sky-100/70 bg-white/70 p-10 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-sky-100 bg-sky-50">
                <Box className="h-7 w-7 text-sky-500" />
              </div>
              <p className="text-base text-slate-700" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                Your Explorer is waiting. Connect a wallet or mint your first buddy to see it populate.
              </p>
              <Button
                className="rounded-full bg-sky-500 px-6 text-white hover:bg-sky-600"
                style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}
                onClick={() => router.push("/#mint")}
              >
                Mint your first NFT
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function VaultLoading() {
  return (
    <main className="min-h-[calc(100dvh-64px)] pb-16 pt-12">
      <section className="mx-auto max-w-6xl px-4">
        <div className="space-y-2">
          <h1 className="text-3xl text-slate-900" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
            Loading Explorer…
          </h1>
          <p className="text-sm text-slate-600" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
            Fetching your latest mints and preparing the vault view.
          </p>
        </div>
      </section>
    </main>
  );
}

export const dynamic = "force-dynamic";

export default function VaultPage() {
  return (
    <Suspense fallback={<VaultLoading />}>
      <VaultContent />
    </Suspense>
  );
}