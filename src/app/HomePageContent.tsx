"use client";

import Link from "next/link";
import MintFirstNFT from "@/components/MintFirstNFT";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const HERO_IMG = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/72578d18-4c28-4032-9a62-d9e4e894b6b4/generated_images/whimsical-storybook-illustration-of-a-sm-6175ae5b-20250927092443.jpg?";

export default function HomePageContent() {
  return (
    <main className="min-h-[100dvh]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden min-h-[100dvh]">
        <div className="absolute inset-0 -z-10">
          <img src={HERO_IMG} alt="Storybook meadow" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-white/60 dark:bg-black/40" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sky-700 tracking-[0.3em] uppercase text-xs sm:text-sm" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
              Meet Nexplorer
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl leading-tight text-slate-900" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
              Your first NFT, guided like a story
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-slate-700" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
              Nexplorer is a gentle sky-hued adventure that guides Web2 friends into Web3. Learn the ropes, mint with confidence, and
              discover your vault without crypto jargon.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-sky-500 hover:bg-sky-600 text-white" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                <Link href="#mint">Mint your first NFT</Link>
              </Button>
              <Button variant="secondary" asChild className="border-sky-400 text-sky-700 hover:bg-sky-100" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                <Link href="#learn">What is an NFT?</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block" />
        </div>
      </section>

      {/* Learn */}
      <section id="learn" className="mx-auto max-w-6xl px-4 py-12 scroll-mt-24 sm:scroll-mt-28">
        <h2 className="text-3xl sm:text-4xl text-slate-900" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>NFTs, explained like a story</h2>
        <p className="text-slate-700 mt-4 text-lg" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
          NFTs are like collectibles in a digital storybook. Each one is unique, ownable, and tradable.
        </p>
        <div className="mt-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-nft">
              <AccordionTrigger className="text-lg sm:text-xl" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
                What is an NFT?
              </AccordionTrigger>
              <AccordionContent className="text-base sm:text-lg leading-relaxed text-slate-700" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                <p className="mb-3">
                  An NFT is a unique digital item with a receipt of ownership stored on a blockchain. Think of it as a rare sticker in your
                  storybook that only you truly own — and everyone can verify it's authentic.
                </p>
                <p>
                  Unlike regular images you can copy, NFTs can be transferred, traded, and connected to perks like access, rewards, or game items.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="why-should-i-care">
              <AccordionTrigger className="text-lg sm:text-xl" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
                Why should I care?
              </AccordionTrigger>
              <AccordionContent className="text-base sm:text-lg leading-relaxed text-slate-700" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                <p className="mb-3">
                  NFTs let you truly own digital things — art, tickets, memberships, even avatars. Because ownership is on a public ledger,
                  you can take your items between apps and marketplaces without being locked in.
                </p>
                <p>
                  Imagine buying a concert pass that doubles as a collectible badge and unlocks future surprises — that's the power of NFTs.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="how-does-it-work">
              <AccordionTrigger className="text-lg sm:text-xl" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
                How does it work?
              </AccordionTrigger>
              <AccordionContent className="text-base sm:text-lg leading-relaxed text-slate-700" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                <p className="mb-3">
                  "Minting" creates your NFT by writing its details to a blockchain. Instead of connecting a wallet here, we rely on World ID to prove you’re a unique human and simulate the transaction flow.
                </p>
                <p>
                  We've made it beginner‑friendly. Try a simulated mint below — no jargon, and no wallet setup required to learn by doing.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Explorer overview */}
      <section id="explorer" className="mx-auto max-w-6xl px-4 py-16 scroll-mt-24 sm:scroll-mt-28">
        <div className="rounded-3xl bg-white/80 backdrop-blur shadow-lg border border-sky-100/70 p-8 sm:p-12">
          <div className="grid gap-8 md:grid-cols-[1.2fr,0.8fr] items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl text-slate-900" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
                How the Explorer keeps your story straight
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-700" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                The Nexplorer dashboard is your friendly control room. Every mint you complete lands in the Explorer automatically, with a
                serial number, timestamp, transaction receipt, and the character image you just claimed.
              </p>
              <ul className="mt-6 grid gap-3 text-base sm:text-lg text-slate-700" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  <span><strong className="text-slate-900">Instant sync:</strong> Finish a mint and the Explorer refreshes without reloading.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  <span><strong className="text-slate-900">Search & filter:</strong> Quickly find your buddies by name, collection, or owner tag.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-sky-500" />
                  <span><strong className="text-slate-900">Export-ready:</strong> Copy the metadata or share a permalink with one click.</span>
                </li>
              </ul>
              <div className="mt-8">
                <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-slate-900" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  <Link href="/vault">Open the Explorer</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-6 bg-sky-200/40 blur-3xl rounded-full" aria-hidden />
              <div className="relative rounded-3xl border border-sky-200 bg-gradient-to-br from-white via-sky-50 to-sky-100 shadow-xl p-6">
                <div className="flex items-center justify-between text-sm text-slate-500" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  <span>Explorer preview</span>
                  <span>Serial 027</span>
                </div>
                <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-white shadow-inner">
                  <img src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/72578d18-4c28-4032-9a62-d9e4e894b6b4/generated_images/cute-storybook-style-collectible-card-fe-0bfb9cd9-20250927092450.jpg?" alt="Explorer preview" className="h-full w-full object-cover" />
                </div>
                <div className="mt-4 grid gap-2 text-sm text-slate-600" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                  <div className="flex items-center justify-between">
                    <span>Owner</span>
                    <span className="font-semibold text-slate-900">guest</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Collection</span>
                    <span className="font-semibold text-slate-900">Nexplorer Genesis</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Minted</span>
                    <span className="font-semibold text-slate-900">Just now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mint */}
      <section id="mint" className="relative mx-auto max-w-6xl px-4 py-12 scroll-mt-24 sm:scroll-mt-28">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl text-slate-900" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
            Mint your Nexplorer buddy
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-700" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
            There’s one illustrated hero for everyone. Each mint issues the next serial number, so every story stays unique — even with the
            same artwork.
          </p>
        </div>
        {/* Subtle dramatic glow to match theme */}
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-60">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-40 w-[28rem] max-w-[90vw] rounded-full bg-sky-300/30 blur-3xl" />
        </div>
        <div className="mt-10">
          <MintFirstNFT />
        </div>
        <div className="mt-8 text-center">
          <Button variant="link" asChild className="text-sky-700 hover:text-sky-900" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
            <Link href="/vault">Go to Vault</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} Nexplorer • A gentle Web3 onboarding tale.</div>
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