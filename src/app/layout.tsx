import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { WorldAppProvider } from "@/context/WorldAppContext";

export const metadata: Metadata = {
  title: "Nexplorer | Your First NFT Adventure",
  description: "A sky-bright journey that guides Web2 explorers to mint their first NFT with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-[radial-gradient(circle_at_20%_20%,#e0f2ff,rgba(255,255,255,0)) ,radial-gradient(circle_at_80%_0%,#c9e6ff,rgba(255,255,255,0.3)) ,linear-gradient(180deg,#f4fbff_0%,#ffffff_60%,#e6f4ff_100%)] text-slate-900">
        <WorldAppProvider>
          <div className="relative min-h-screen">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(600px_400px_at_20%_10%,rgba(14,165,233,0.12),transparent),radial-gradient(500px_500px_at_80%_20%,rgba(59,130,246,0.1),transparent)]" />
          <header className="sticky top-0 z-40 backdrop-blur border-b border-sky-200/60 bg-sky-100/70">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
              <Link href="/" className="text-xl font-semibold text-sky-900" style={{ fontFamily: "Chewy, system-ui, sans-serif" }}>
                Nexplorer
              </Link>
              <nav className="flex items-center gap-6 text-sm" style={{ fontFamily: "Short Stack, system-ui, sans-serif" }}>
                <Link href="/" className="text-sky-900/80 hover:text-sky-900 transition-colors">
                  Home
                </Link>
                <Link href="/vault" className="text-sky-900/80 hover:text-sky-900 transition-colors">
                  Explorer
                </Link>
              </nav>
            </div>
          </header>

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
          <main>{children}</main>
          <VisualEditsMessenger />
          <Toaster richColors position="top-center" />
          </div>
        </WorldAppProvider>
      </body>
    </html>
  );
}