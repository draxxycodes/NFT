"use client";

import Link from "next/link";
import MintFirstNFT from "@/components/MintFirstNFT";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const HERO_IMG = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/72578d18-4c28-4032-9a62-d9e4e894b6b4/generated_images/whimsical-storybook-illustration-of-a-sm-6175ae5b-20250927092443.jpg?";

export default function HomePageContent() {
  return (
    <main className="min-h-[calc(100dvh-64px)]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={HERO_IMG} alt="Storybook meadow" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-white/60 dark:bg-black/40" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl leading-tight" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
              Welcome to NFC.E
            </h1>
            <p className="mt-4 text-lg" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
              A storybook adventure that helps Web2 explorers discover Web3 and mint their first NFT — no jargon, just magic.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link href="#mint">Mint your first NFT</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="#learn">What is an NFT?</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block" />
        </div>
      </section>

      {/* Learn */}
      <section id="learn" className="mx-auto max-w-6xl px-4 py-12 scroll-mt-24 sm:scroll-mt-28">
        <h2 className="text-3xl" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>NFTs, explained like a story</h2>
        <p className="text-muted-foreground mt-2" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
          NFTs are like collectibles in a digital storybook. Each one is unique, ownable, and tradable.
        </p>
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-nft">
              <AccordionTrigger>What is an NFT?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  An NFT is a unique digital item with a receipt of ownership stored on a blockchain. Think of it as a rare sticker in your
                  storybook that only you truly own — and everyone can verify it's authentic.
                </p>
                <p style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  Unlike regular images you can copy, NFTs can be transferred, traded, and connected to perks like access, rewards, or game items.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="why-should-i-care">
              <AccordionTrigger>Why should I care?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  NFTs let you truly own digital things — art, tickets, memberships, even avatars. Because ownership is on a public ledger,
                  you can take your items between apps and marketplaces without being locked in.
                </p>
                <p style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  Imagine buying a concert pass that doubles as a collectible badge and unlocks future surprises — that's the power of NFTs.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how-does-it-work">
              <AccordionTrigger>How does it work?</AccordionTrigger>
              <AccordionContent>
                <p className="mb-3" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  "Minting" creates your NFT by writing its details to a blockchain. A wallet (like MetaMask) signs the action.
                </p>
                <p style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  We've made it beginner‑friendly. Try a simulated mint below — no jargon, just a simple flow to learn by doing.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Mint */}
      <section id="mint" className="relative mx-auto max-w-6xl px-4 py-12 scroll-mt-24 sm:scroll-mt-28">
        <h2 className="text-3xl mb-4" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>Mint your buddy</h2>
        <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
          Connect a wallet or mint as a Guest to get the feel. After minting, we will take you to your Vault.
        </p>
        {/* Subtle dramatic glow to match theme */}
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-40">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-40 w-[28rem] max-w-[90vw] rounded-full bg-fuchsia-400/10 blur-3xl" />
        </div>
        <MintFirstNFT />
        <div className="mt-6">
          <Button variant="link" asChild>
            <Link href="/vault">Go to Vault</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} NFC.E • A gentle Web3 onboarding tale.</div>
            <nav className="flex items-center gap-4">
              <Link href="/#learn" className="hover:underline">Learn</Link>
              <Link href="/#mint" className="hover:underline">Mint</Link>
              <Link href="/vault" className="hover:underline">Vault</Link>
            </nav>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="Twitter" className="hover:underline">Twitter</a>
              <a href="#" aria-label="Discord" className="hover:underline">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}