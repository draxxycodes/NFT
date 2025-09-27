"use client";

import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, CheckCircle, AlertCircle, Globe, User, Wallet } from 'lucide-react';
import { toast } from 'sonner';

// Types for World ID integration
interface WorldIDUser {
  nullifierHash?: string;
  merkleRoot?: string;
  verificationLevel?: 'orb' | 'device';
  isVerified: boolean;
  walletAddress?: string;
}

interface WorldAppConnection {
  isConnected: boolean;
  isInstalled: boolean;
  canVerify: boolean;
}

export function WorldIDConnector() {
  const [user, setUser] = useState<WorldIDUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [worldAppStatus, setWorldAppStatus] = useState<WorldAppConnection>({
    isConnected: false,
    isInstalled: false,
    canVerify: false,
  });

  // Check World App availability on component mount
  useEffect(() => {
    checkWorldAppStatus();
  }, []);

  const checkWorldAppStatus = useCallback(() => {
    // Check if we're in World App (miniapp environment)
    const isInWorldApp = typeof window !== 'undefined' && 
      (window.location.hostname.includes('worldapp://') || 
       window.navigator.userAgent.includes('WorldApp'));

    // Check for MiniKit availability (simulated)
    const isMiniKitAvailable = typeof window !== 'undefined' && 
      !!(window as any).MiniKit;

    setWorldAppStatus({
      isConnected: false,
      isInstalled: isInWorldApp || isMiniKitAvailable,
      canVerify: isInWorldApp || isMiniKitAvailable,
    });
  }, []);

  const connectWallet = async () => {
    setLoading(true);
    try {
      // Try to connect to MetaMask or other Web3 wallet
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        if (accounts.length > 0) {
          setUser({
            isVerified: false,
            walletAddress: accounts[0],
          });
          toast.success('Wallet connected! Verify with World ID for full access.');
        }
      } else {
        toast.error('No Web3 wallet detected. Please install MetaMask or open in World App.');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  };

  const verifyWithWorldID = async () => {
    setLoading(true);
    try {
      // Simulate World ID verification
      // In a real implementation, this would use MiniKit's verify command
      
      if (worldAppStatus.canVerify) {
        // Simulate successful verification
        setTimeout(() => {
          const simulated = {
            isVerified: true,
            verificationLevel: 'orb' as const,
            nullifierHash: '0x' + Math.random().toString(16).substr(2, 64),
            merkleRoot: '0x' + Math.random().toString(16).substr(2, 64),
          };

          setUser(prev => prev ? {
            ...prev,
            ...simulated,
          } : null);
          
          setWorldAppStatus(prev => ({
            ...prev,
            isConnected: true,
          }));
          
          // Call backend verify stub for parity with MiniKit flows
          fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nullifierHash: simulated.nullifierHash,
              merkleRoot: simulated.merkleRoot,
              proof: '0x' + Math.random().toString(16).substr(2, 64),
              actionId: 'demo-action',
              verificationLevel: simulated.verificationLevel,
            }),
          }).catch(() => undefined);

          toast.success('Successfully verified with World ID!');
          setLoading(false);
        }, 2000);
      } else {
        // For demo purposes, simulate verification even without World App
        setTimeout(() => {
          const simulated = {
            isVerified: true,
            verificationLevel: 'device' as const,
            nullifierHash: '0x' + Math.random().toString(16).substr(2, 64),
          };

          setUser(prev => prev ? {
            ...prev,
            ...simulated,
          } : {
            isVerified: true,
            verificationLevel: 'device',
            walletAddress: '0x742d35Cc6634C0532925a3b8D9c9084dbC27A95b',
            nullifierHash: simulated.nullifierHash,
          });
          
          // Call backend verify stub
          fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nullifierHash: simulated.nullifierHash,
              proof: '0x' + Math.random().toString(16).substr(2, 64),
              actionId: 'demo-action',
              verificationLevel: simulated.verificationLevel,
            }),
          }).catch(() => undefined);

          toast.success('Demo verification successful! (Open in World App for real verification)');
          setLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error('World ID verification failed:', error);
      toast.error('World ID verification failed');
      setLoading(false);
    }
  };

  const disconnect = () => {
    setUser(null);
    setWorldAppStatus(prev => ({
      ...prev,
      isConnected: false,
    }));
    toast.info('Disconnected from World ID');
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="h-5 w-5" />
          World ID Authentication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* World App Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-300">World App Status</span>
          </div>
          <Badge variant={worldAppStatus.isInstalled ? "default" : "secondary"}>
            {worldAppStatus.isInstalled ? 'Detected' : 'Not Installed'}
          </Badge>
        </div>

        {user ? (
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {user.walletAddress ? user.walletAddress.slice(2, 4).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">
                    {user.walletAddress ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}` : 'Anonymous User'}
                  </span>
                  {user.isVerified && (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {user.isVerified 
                    ? `Verified Human (${user.verificationLevel === 'orb' ? 'Orb' : 'Device'})` 
                    : 'Unverified'
                  }
                </p>
              </div>
            </div>

            {/* Verification Status */}
            {user.isVerified ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>World ID Verified</span>
                </div>
                {user.nullifierHash && (
                  <div className="text-xs text-gray-400">
                    <span>Nullifier: {user.nullifierHash.slice(0, 10)}...{user.nullifierHash.slice(-8)}</span>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={disconnect}
                  className="w-full text-white border-white/20 hover:bg-white/10"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>World ID verification required for full access</span>
                </div>
                <Button 
                  onClick={verifyWithWorldID} 
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Verifying...' : 'Verify with World ID'}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              Connect your wallet and verify with World ID to access exclusive NFT features and prove your humanity.
            </p>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={connectWallet} 
                disabled={loading}
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Wallet className="h-4 w-4 mr-1" />
                {loading ? 'Connecting...' : 'Connect Wallet'}
              </Button>
              <Button 
                onClick={verifyWithWorldID} 
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Shield className="h-4 w-4 mr-1" />
                {loading ? 'Verifying...' : 'World ID'}
              </Button>
            </div>

            {!worldAppStatus.isInstalled && (
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-blue-400 text-xs">
                  💡 For the best experience, open this app in World App or install World App on your device.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Benefits List */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-2">World ID Benefits:</p>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Verify ownership of rare NFTs</li>
            <li>• Access exclusive human-only collections</li>
            <li>• Participate in verified-only airdrops</li>
            <li>• Prove authenticity in trading</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook to use World ID context throughout the app
export function useWorldID() {
  const [user, setUser] = useState<WorldIDUser | null>(null);
  
  return {
    user,
    isVerified: user?.isVerified || false,
    isConnected: !!user,
    verificationLevel: user?.verificationLevel,
    walletAddress: user?.walletAddress,
  };
}