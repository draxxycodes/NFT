"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [name, setName] = useState("My First NFC.E");
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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

  const handleFile = (file?: File) => {
    if (!file) return setImagePreview(null);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const mint = async () => {
    setLoading(true);
    try {
      const txHash = "0x" + Math.random().toString(16).slice(2).padEnd(64, "0");
      const owner = account ?? "guest";
      const newNFT = {
        id: `${Date.now()}`,
        name: name.trim() || "My First NFC.E",
        image: imagePreview || HERO_NFT_IMG,
        description: "Your very first on-chain buddy (simulated). Welcome to the story!",
        txHash,
        owner,
        timestamp: Date.now(),
      };
      const nfts = readNFTs();
      nfts.push(newNFT as any);
      writeNFTs(nfts as any);
      toast.success("Minted! Redirecting to your Vault...");
      setOpen(false);
      router.push("/vault?justMinted=1");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl shadow-lg border border-border/60 bg-gradient-to-b from-card/80 to-card/60 backdrop-blur">
      <CardHeader>
        <CardTitle style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>Mint your first NFT</CardTitle>
        <CardDescription className="text-base" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
          Name your buddy, optionally add your own image, then mint. Connect MetaMask or mint as a friendly Guest.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid sm:grid-cols-[96px,1fr] gap-4 items-start">
          <div className="relative h-24 w-24 rounded-xl overflow-hidden border bg-secondary/40">
            <img src={imagePreview || HERO_NFT_IMG} alt="NFT preview" className="h-full w-full object-cover" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm">NFT Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name your buddy" />
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-1">
                <label className="text-sm">NFT Image (optional)</label>
                <Input type="file" accept="image/*" onChange={(e) => handleFile(e.target.files?.[0])} />
              </div>
              <p className="text-xs text-muted-foreground self-end">Owner: {ownerLabel}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
          Tip: You can change the image later when you wire up your smart contract's tokenURI.
        </p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={loading}>Review & Mint</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>Confirm mint</DialogTitle>
              <DialogDescription style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                Please review your NFT details before minting. This is a simulated mint for onboarding.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-start gap-4">
              <img src={imagePreview || HERO_NFT_IMG} alt="NFT preview" className="h-20 w-20 rounded-lg object-cover border" />
              <div className="text-sm">
                <div className="font-medium">Name</div>
                <div className="mb-2">{name.trim() || "My First NFC.E"}</div>
                <div className="font-medium">Owner</div>
                <div className="text-muted-foreground">{ownerLabel}</div>
              </div>
            </div>
            <DialogFooterUI className="gap-2">
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={mint} disabled={loading}>{loading ? "Minting..." : "Mint Now"}</Button>
            </DialogFooterUI>
          </DialogContent>
        </Dialog>
        <Button variant="secondary" onClick={connect} disabled={!!account}>{account ? "Wallet Connected" : "Connect Wallet"}</Button>
      </CardFooter>
    </Card>
  );
}