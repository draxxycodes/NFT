"use client";

import NFTExplorer from '@/components/NFTExplorer';
import { WorldIDConnector } from '@/components/WorldIDConnector';
import MiniAppIntegration from '@/components/MiniAppIntegration';

export default function ExplorePage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* World ID Authentication */}
              <WorldIDConnector />
              
              {/* MiniApp Integration */}
              <MiniAppIntegration />
              
              {/* Quick Stats */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">World Chain Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Total NFTs</span>
                    <span className="text-white font-medium">127,456</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Collections</span>
                    <span className="text-white font-medium">3,892</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Active Traders</span>
                    <span className="text-white font-medium">45,123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Volume (24h)</span>
                    <span className="text-white font-medium">1,234 ETH</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <div className="space-y-2">
                  <a 
                    href="https://worldscan.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    🔍 World Chain Explorer
                  </a>
                  <a 
                    href="https://docs.world.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    📖 World ID Documentation
                  </a>
                  <a 
                    href="https://docs.world.org/mini-apps" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    🧩 MiniApp Development
                  </a>
                  <a 
                    href="https://worldapp.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    🌍 Download World App
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <NFTExplorer />
          </div>
        </div>
      </div>
    </div>
  );
}