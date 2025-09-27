"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter as DialogFooterUI, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

const STORAGE_KEY = "storymint_nfts";
const HERO_NFT_IMG = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/72578d18-4c28-4032-9a62-d9e4e894b6b4/generated_images/cute-storybook-style-collectible-card-fe-0bfb9cd9-20250927092450.jpg?";

type MintedNFT = {
  id: string;
  name: string;
  image: string;
  description: string;
  txHash: string;
  owner: string; // wallet or "guest"
  timestamp: number;
};

function readNFTs(): MintedNFT[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MintedNFT[]) : [];
  } catch {
    return [];
  }
}

function writeNFTs(nfts: MintedNFT[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(nfts));
}

export default function MintFirstNFT() {
  const router = useRouter();
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const mintedName = "Nexplorer Genesis Buddy";
  const [open, setOpen] = useState(false);

  const ownerLabel = useMemo(() => (account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Guest"), [account]);

  useEffect(() => {
    // Try to eagerly fetch account if already connected
    async function detect() {
      const anyWindow = window as any;
      if (anyWindow?.ethereum?.request) {
        try {
          const accs: string[] = await anyWindow.ethereum.request({ method: "eth_accounts" });
          if (accs && accs.length > 0) setAccount(accs[0]);
        } catch {
          // ignore
        }
      }
    }
    if (typeof window !== "undefined") detect();
  }, []);

  const connect = async () => {
    const anyWindow = window as any;
    if (!anyWindow?.ethereum?.request) {
      toast.info("No wallet detected. You can still mint as a Guest!");
      return;
    }
    try {
      const accs: string[] = await anyWindow.ethereum.request({ method: "eth_requestAccounts" });
      if (accs && accs.length > 0) {
        setAccount(accs[0]);
        toast.success("Wallet connected");
      }
    } catch (e) {
      console.error(e);
      toast.error("Could not connect wallet. You can mint as a Guest instead.");
    }
  };

  const mint = async () => {
    setLoading(true);
    try {
      const txHash = "0x" + Math.random().toString(16).slice(2).padEnd(64, "0");
      const owner = account ?? "guest";
      const newNFT = {
        id: `${Date.now()}`,
  name: mintedName,
        image: HERO_NFT_IMG,
        description: "Your very first on-chain buddy (simulated). Welcome to the story!",
        txHash,
        owner,
        timestamp: Date.now(),
      };
      const nfts = readNFTs();
      nfts.push(newNFT as any);
      writeNFTs(nfts as any);
  toast.success("Minted! Redirecting to your Explorer vault...");
      setOpen(false);
      router.push("/vault?justMinted=1");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-3xl shadow-xl border border-sky-200/70 bg-white/85 backdrop-blur">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="text-sky-900 text-2xl" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>Mint your first NFT</CardTitle>
        <CardDescription className="text-base text-slate-600" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
          Mint serials of our shared hero artwork. Each click adds the next entry to your Explorer vault.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="relative mx-auto w-full max-w-sm">
          <div className="absolute -inset-6 rounded-[2.5rem] bg-sky-200/50 blur-3xl" aria-hidden />
          <div className="relative overflow-hidden rounded-[2rem] border border-sky-200 shadow-lg bg-white">
            <img src={HERO_NFT_IMG} alt="Nexplorer hero" className="h-full w-full object-cover" />
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={loading}
              className="mx-auto w-full max-w-xs rounded-full bg-yellow-400 px-6 py-3 text-base font-semibold text-slate-900 shadow hover:bg-yellow-300"
              style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}
            >
              Mint you first NFT
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>Confirm mint</DialogTitle>
              <DialogDescription style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                Review your buddy before we add the next serial to your Explorer vault.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-start gap-4">
              <img src={HERO_NFT_IMG} alt="NFT preview" className="h-20 w-20 rounded-lg object-cover border" />
              <div className="text-sm" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                <div className="font-medium text-slate-900">Name</div>
                <div className="mb-2">{mintedName}</div>
                <div className="font-medium text-slate-900">Owner</div>
                <div className="text-muted-foreground">{ownerLabel}</div>
              </div>
            </div>
            <DialogFooterUI className="gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={mint} disabled={loading} className="bg-yellow-400 text-slate-900 hover:bg-yellow-300">
                {loading ? "Minting..." : "Confirm mint"}
              </Button>
            </DialogFooterUI>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row items-center justify-end gap-4">
        <Button
          variant="secondary"
          onClick={connect}
          disabled={!!account}
          className="w-full sm:w-auto border-sky-300 text-sky-800 hover:bg-sky-100"
          style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}
        >
          {account ? "Wallet connected" : "Connect wallet"}
        </Button>
      </CardFooter>
    </Card>
  );
}