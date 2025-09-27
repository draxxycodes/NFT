import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "NFC.E | Your First NFT Adventure",
  description: "A storybook-themed journey that onboards Web2 explorers to Web3 and NFTs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {/* Animated Minimal Dark Background */}
        <div aria-hidden className="fixed inset-0 -z-50">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(120,119,198,0.12),transparent_60%),radial-gradient(1000px_500px_at_80%_10%,rgba(56,189,248,0.12),transparent_60%),radial-gradient(1200px_800px_at_50%_110%,rgba(34,197,94,0.08),transparent_60%)] dark:opacity-100 opacity-70" />
          <div className="pointer-events-none absolute -top-40 -left-20 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl animate-pulse" />
          <div className="pointer-events-none absolute -bottom-40 -right-20 h-[28rem] w-[28rem] rounded-full bg-cyan-400/10 blur-3xl animate-pulse" />
          <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl animate-pulse" />
        </div>

        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <header className="sticky top-0 z-40 backdrop-blur bg-background/70 border-b">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold" aria-label="NFC.E Home">
              NFC.E
            </Link>
            {/* Desktop Nav */}
            <div className="hidden md:flex gap-4 text-sm">
              <Link href="/" className="hover:underline">Home</Link>
              <Link href="/explore" className="hover:underline">Explore</Link>
              <Link href="/collections" className="hover:underline">Collections</Link>
              <Link href="/vault" className="hover:underline">My Vault</Link>
            </div>
            {/* Mobile Nav */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Open menu">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72">
                  <div className="mt-8 grid gap-4 text-base">
                    <Link href="/" className="hover:underline">Home</Link>
                    <Link href="/explore" className="hover:underline">Explore</Link>
                    <Link href="/collections" className="hover:underline">Collections</Link>
                    <Link href="/vault" className="hover:underline">My Vault</Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </nav>
        </header>
        {children}
        <VisualEditsMessenger />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}