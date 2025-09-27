"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Globe, Shield, Wallet, ExternalLink } from 'lucide-react';
import { WORLD_CONFIG } from '@/lib/types';

// World App Mini App integration
declare global {
  interface Window {
    MiniKit?: any;
    WorldApp?: any;
  }
}

interface MiniAppStatus {
  isInWorldApp: boolean;
  canUseMiniKit: boolean;
  worldAppVersion?: string;
  features: {
    worldID: boolean;
    payments: boolean;
    wallet: boolean;
    notifications: boolean;
  };
}

export function MiniAppIntegration() {
  const [status, setStatus] = useState<MiniAppStatus>({
    isInWorldApp: false,
    canUseMiniKit: false,
    features: {
      worldID: false,
      payments: false,
      wallet: false,
      notifications: false,
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkMiniAppStatus();
    setupMiniKitListeners();
  }, []);

  const checkMiniAppStatus = () => {
    const isInWorldApp = typeof window !== 'undefined' && (
      window.location.href.includes('worldapp://') ||
      window.navigator.userAgent.includes('WorldApp') ||
      window.location.hostname.includes('.worldapp.org')
    );

    const canUseMiniKit = typeof window !== 'undefined' && !!(window as any).MiniKit;

    setStatus({
      isInWorldApp,
      canUseMiniKit,
      worldAppVersion: isInWorldApp ? '2.8.7' : undefined,
      features: {
        worldID: isInWorldApp || canUseMiniKit,
        payments: isInWorldApp || canUseMiniKit,
        wallet: isInWorldApp || canUseMiniKit,
        notifications: isInWorldApp || canUseMiniKit,
      }
    });
  };

  const setupMiniKitListeners = () => {
    if (typeof window !== 'undefined' && (window as any).MiniKit) {
      // Set up MiniKit event listeners
      console.log('MiniKit detected, setting up listeners...');
    }
  };

  const initializeMiniApp = async () => {
    setLoading(true);
    try {
      if (status.isInWorldApp) {
        toast.success('World App detected! Full functionality available.');
      } else {
        // Simulate mini app initialization for demo
        setTimeout(() => {
          toast.info('Demo mode: Open in World App for full experience.');
          setLoading(false);
        }, 1000);
        return;
      }
      
      // Initialize MiniKit if available
      if ((window as any).MiniKit) {
        await (window as any).MiniKit.install();
        toast.success('MiniKit initialized successfully!');
      }
    } catch (error) {
      console.error('Failed to initialize MiniApp:', error);
      toast.error('Failed to initialize World App features');
    } finally {
      setLoading(false);
    }
  };

  const openInWorldApp = () => {
    const currentUrl = WORLD_CONFIG.PUBLIC_URL || window.location.href;
    const worldAppUrl = `${WORLD_CONFIG.WORLD_APP_DEEPLINK_PREFIX}${encodeURIComponent(currentUrl)}`;
    window.location.href = worldAppUrl;
    
    // Fallback: Show instructions
    setTimeout(() => {
      toast.info('To use World App features, please install World App from the App Store or Google Play.');
    }, 1000);
  };

  const testMiniKitFeature = async (feature: string) => {
    if (!status.canUseMiniKit && !status.isInWorldApp) {
      toast.error(`${feature} requires World App. Click "Open in World App" to access this feature.`);
      return;
    }

    setLoading(true);
    try {
      switch (feature) {
        case 'worldID':
          // Simulate World ID verification
          setTimeout(() => {
            toast.success('World ID verification successful! (Demo)');
            setLoading(false);
          }, 2000);
          break;
          
        case 'wallet':
          // Simulate wallet connection
          setTimeout(() => {
            toast.success('Wallet connected successfully! (Demo)');
            setLoading(false);
          }, 1500);
          break;
          
        case 'payments':
          // Simulate payment
          setTimeout(() => {
            toast.success('Payment feature available! (Demo)');
            setLoading(false);
          }, 1000);
          break;
          
        case 'notifications':
          // Simulate notification permission
          setTimeout(() => {
            toast.success('Notification permissions granted! (Demo)');
            setLoading(false);
          }, 1000);
          break;
          
        default:
          setLoading(false);
          break;
      }
    } catch (error) {
      console.error(`Failed to test ${feature}:`, error);
      toast.error(`Failed to test ${feature}`);
      setLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Smartphone className="h-5 w-5" />
          World App Integration
          <Badge variant={status.isInWorldApp ? "default" : "secondary"} className="ml-2">
            {status.isInWorldApp ? 'Active' : 'Demo Mode'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-300">Environment</span>
            </div>
            <Badge variant={status.isInWorldApp ? "default" : "outline"}>
              {status.isInWorldApp ? 'World App' : 'Web Browser'}
            </Badge>
          </div>

          {status.worldAppVersion && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-300">App Version</span>
              </div>
              <span className="text-sm text-white">{status.worldAppVersion}</span>
            </div>
          )}
        </div>

        {/* Feature Status */}
        <div className="space-y-2">
          <h4 className="text-white font-medium text-sm">Available Features</h4>
          <div className="space-y-2">
            {Object.entries(status.features).map(([feature, available]) => (
              <div key={feature} className="flex items-center justify-between p-2 rounded bg-white/5">
                <span className="text-sm text-gray-300 capitalize">
                  {feature === 'worldID' ? 'World ID' : feature}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant={available ? "default" : "outline"} className="text-xs">
                    {available ? 'Available' : 'Unavailable'}
                  </Badge>
                  {available && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => testMiniKitFeature(feature)}
                      disabled={loading}
                      className="h-6 px-2 text-xs text-blue-400 hover:text-blue-300"
                    >
                      Test
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-4 border-t border-white/10">
          {!status.isInWorldApp ? (
            <div className="space-y-2">
              <Button 
                onClick={openInWorldApp} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Open in World App
              </Button>
              <p className="text-xs text-gray-400 text-center">
                For full functionality including World ID verification, payments, and notifications.
              </p>
            </div>
          ) : (
            <Button 
              onClick={initializeMiniApp} 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Initializing...' : 'Initialize MiniApp Features'}
            </Button>
          )}
        </div>

        {/* Developer Info */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-2">Developer Notes:</p>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• This is a World Chain NFT Explorer mini app</li>
            <li>• World ID verification enables exclusive features</li>
            <li>• Payments work with WLD and USDC on World Chain</li>
            <li>• All features work best in World App environment</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.open('https://docs.world.org/mini-apps', '_blank')}
            className="text-xs text-blue-400 border-blue-400/20"
          >
            📖 Docs
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.open('https://worldapp.org', '_blank')}
            className="text-xs text-blue-400 border-blue-400/20"
          >
            📱 Get World App
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default MiniAppIntegration;