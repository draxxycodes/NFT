"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, AlertCircle, Globe, RefreshCw } from 'lucide-react';
import { useWorldApp } from '@/context/WorldAppContext';

export function WorldIDConnector() {
  const { worldAppStatus, isVerified, isVerifying, verification, verifyHuman, resetVerification } = useWorldApp();

  const nullifierPreview = useMemo(() => {
    if (!verification?.nullifierHash) return null;
    return `${verification.nullifierHash.slice(0, 10)}...${verification.nullifierHash.slice(-8)}`;
  }, [verification?.nullifierHash]);

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="h-5 w-5" />
          World ID Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-300">World App Status</span>
          </div>
          <Badge variant={worldAppStatus.isInstalled ? 'default' : 'secondary'}>
            {worldAppStatus.isInstalled ? 'Detected' : 'Unavailable'}
          </Badge>
        </div>

        <div className="space-y-4">
          <p className="text-gray-300 text-sm">
            Use the World App to prove you are a unique human. Once verified, gated features across the mini app unlock instantly.
          </p>

          <Button
            onClick={() => verifyHuman()}
            disabled={isVerifying || !worldAppStatus.canVerify}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Shield className="h-4 w-4 mr-1" />
            {isVerifying ? 'Opening World App…' : isVerified ? 'Verified with World ID' : 'Verify with World ID'}
          </Button>

          {!worldAppStatus.isInstalled && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200">
              Open this mini app inside the World App to complete verification.
            </div>
          )}

          {isVerified ? (
            <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-gray-200">
              <div className="flex items-center gap-2 text-green-300">
                <CheckCircle className="h-4 w-4" />
                <span>Verification complete</span>
              </div>
              {nullifierPreview && (
                <div className="text-xs text-gray-400">
                  <span className="font-medium text-gray-300">Nullifier:</span> {nullifierPreview}
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <RefreshCw className="h-3 w-3" />
                <span>Reuse this verification to unlock gated flows without re-authenticating.</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetVerification}
                className="text-white border-white/20 hover:bg-white/10"
              >
                Clear verification
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-300 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Verification required to access human-gated content.</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400 mb-2">World ID unlocks:</p>
          <ul className="text-xs text-gray-300 space-y-1">
            <li>• Proof of personhood for your mini app</li>
            <li>• Gating flows by unique humans</li>
            <li>• Safer communities without wallet connections</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default WorldIDConnector;