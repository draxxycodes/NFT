"use client";

import HomePageContent from "./HomePageContent";

// Force dynamic rendering to avoid prerendering issues
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return <HomePageContent />;
} 