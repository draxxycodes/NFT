"use client";

import Link from "next/link";
import MintFirstNFT from "@/components/MintFirstNFT";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Wallet, Shield, TrendingUp, Users, Eye, Sparkles } from "lucide-react";

const HERO_IMG = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/72578d18-4c28-4032-9a62-d9e4e894b6b4/generated_images/whimsical-storybook-illustration-of-a-sm-6175ae5b-20250927092443.jpg?";

export default function HomePageContent() {
  return (
    <main className="min-h-[calc(100dvh-64px)]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img src={HERO_IMG} alt="NFT Explorer" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-white/60 dark:bg-black/40" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl leading-tight" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
              Discover NFTs on World Chain
            </h1>
            <p className="mt-4 text-lg" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
              The ultimate NFT explorer for World Chain. Discover, collect, and trade verified human-owned digital assets with World ID integration.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg">
                <Link href="/explore">
                  <Search className="h-4 w-4 mr-2" />
                  Explore NFTs
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/collections">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Browse Collections
                </Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block" />
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
            Why Choose Our NFT Explorer?
          </h2>
          <p className="text-muted-foreground text-lg" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
            Built specifically for World Chain with World ID verification
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>World ID Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Verify your humanity with World ID and access exclusive verified-only NFT collections and features.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                <Wallet className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>World Chain Native</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Built specifically for World Chain with fast, low-cost transactions and seamless wallet integration.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Advanced Explorer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Comprehensive search, filtering, and analytics tools to discover and analyze NFTs like never before.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-muted/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">127K+</div>
              <div className="text-sm text-muted-foreground">Total NFTs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">3.9K+</div>
              <div className="text-sm text-muted-foreground">Collections</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">45K+</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1.2K ETH</div>
              <div className="text-sm text-muted-foreground">24h Volume</div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn */}
      <section id="learn" className="mx-auto max-w-6xl px-4 py-12 scroll-mt-24 sm:scroll-mt-28">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="text-3xl mb-4" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>
              NFTs on World Chain
            </h2>
            <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
              Understand how NFTs work on World Chain and why World ID verification matters for digital ownership.
            </p>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="what-is-world-chain">
                <AccordionTrigger>What is World Chain?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                    World Chain is a blockchain built for humans, featuring World ID integration for verified human participation.
                    It offers fast, cheap transactions optimized for everyday use.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="world-id-benefits">
                <AccordionTrigger>Why World ID for NFTs?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                    World ID verification ensures that NFT collections remain human-only, preventing bot manipulation
                    and creating more authentic digital communities around your collectibles.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="how-to-get-started">
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
                    Simply connect your wallet and optionally verify with World ID for full access. Browse collections,
                    search for specific NFTs, or start collecting your favorites.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="space-y-6">
            {/* Quick Start Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">1</Badge>
                  <span>Connect your wallet</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">2</Badge>
                  <span>Verify with World ID (optional)</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary">3</Badge>
                  <span>Start exploring NFTs</span>
                </div>
                <Button className="w-full mt-4" asChild>
                  <Link href="/explore">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Popular Collections Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                      <span className="font-medium">World ID Genesis</span>
                    </div>
                    <Badge>+15.2%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600"></div>
                      <span className="font-medium">Cosmic Wanderers</span>
                    </div>
                    <Badge>+8.7%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-pink-500 to-red-600"></div>
                      <span className="font-medium">Digital Phoenixes</span>
                    </div>
                    <Badge>+12.4%</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/collections">View All Collections</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mint */}
      <section id="mint" className="relative mx-auto max-w-6xl px-4 py-12 scroll-mt-24 sm:scroll-mt-28">
        <h2 className="text-3xl mb-4" style={{ fontFamily: 'Chewy, system-ui, sans-serif' }}>Try minting your first NFT</h2>
        <p className="text-muted-foreground mb-6" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
          Get started with NFTs by minting your first one. This is a demo to show you how easy it can be.
        </p>
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-40">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 h-40 w-[28rem] max-w-[90vw] rounded-full bg-fuchsia-400/10 blur-3xl" />
        </div>
        <MintFirstNFT />
        <div className="mt-6 text-center">
          <Button variant="link" asChild>
            <Link href="/vault">View Your Collection</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground" style={{ fontFamily: 'Short Stack, system-ui, sans-serif' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>© {new Date().getFullYear()} World Chain NFT Explorer • Powered by World ID</div>
            <nav className="flex items-center gap-4">
              <Link href="/explore" className="hover:underline">Explore</Link>
              <Link href="/collections" className="hover:underline">Collections</Link>
              <Link href="/vault" className="hover:underline">My Vault</Link>
            </nav>
            <div className="flex items-center gap-3">
              <a href="https://docs.world.org" target="_blank" rel="noopener noreferrer" className="hover:underline">Docs</a>
              <a href="https://worldapp.org" target="_blank" rel="noopener noreferrer" className="hover:underline">World App</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}