"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MiniKit, VerificationLevel, ISuccessResult } from "@worldcoin/minikit-js";
import { toast } from "sonner";
import type { WorldIDVerification } from "@/lib/types";
import { WORLD_CONFIG } from "@/lib/types";

type WorldAppStatus = {
  isInstalled: boolean;
  canVerify: boolean;
  environment: "world-app" | "browser";
};

type VerifyOptions = {
  signal?: string;
};

type MiniKitVerifyCommandInput = {
  action: string;
  signal?: string;
  verification_level?: VerificationLevel;
};

type WorldAppContextValue = {
  worldAppStatus: WorldAppStatus;
  isVerified: boolean;
  isVerifying: boolean;
  verification: WorldIDVerification | null;
  identityKey: string;
  verifyHuman: (options?: VerifyOptions) => Promise<void>;
  resetVerification: () => void;
};

const WorldAppContext = createContext<WorldAppContextValue | undefined>(undefined);

const DEFAULT_STATUS: WorldAppStatus = {
  isInstalled: false,
  canVerify: false,
  environment: "browser",
};

function safeIsMiniKitInstalled() {
  try {
    return typeof MiniKit.isInstalled === "function" ? MiniKit.isInstalled() : false;
  } catch (error) {
    console.debug("MiniKit installation check failed", error);
    return false;
  }
}

function evaluateEnvironment(): WorldAppStatus {
  if (typeof window === "undefined") {
    return DEFAULT_STATUS;
  }

  const isInWorldApp =
    window.location.hostname.includes("worldapp://") ||
    window.location.hostname.includes(".worldapp.org") ||
    window.navigator.userAgent.includes("WorldApp");

  const miniKitAvailable = safeIsMiniKitInstalled();

  return {
    isInstalled: isInWorldApp || miniKitAvailable,
    canVerify: isInWorldApp || miniKitAvailable,
    environment: isInWorldApp ? "world-app" : "browser",
  };
}

export function WorldAppProvider({ children }: { children: React.ReactNode }) {
  const [verification, setVerification] = useState<WorldIDVerification | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [worldAppStatus, setWorldAppStatus] = useState<WorldAppStatus>(DEFAULT_STATUS);

  const updateStatus = useCallback(() => {
    setWorldAppStatus(evaluateEnvironment());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    try {
      if (typeof MiniKit.install === "function") {
        MiniKit.install();
      }
    } catch (error) {
      console.debug("MiniKit install skipped", error);
    }

    updateStatus();

    const handleVisibility = () => updateStatus();
    window.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [updateStatus]);

  const verifyHuman = useCallback(
    async (options?: VerifyOptions) => {
      if (!MiniKit.commandsAsync?.verify) {
        toast.error("World ID verification requires the World App MiniKit.");
        return;
      }

      const verifyPayload: MiniKitVerifyCommandInput = {
        action: WORLD_CONFIG.MINIKIT_VERIFY_ACTION,
        verification_level: VerificationLevel.Orb,
      };

      if (options?.signal) {
        verifyPayload.signal = options.signal;
      }

      const actionId = typeof verifyPayload.action === "string" ? verifyPayload.action : String(verifyPayload.action);

      if (!actionId || !actionId.startsWith("action_")) {
        toast.error(
          "World ID action ID missing. Set NEXT_PUBLIC_MINIKIT_VERIFY_ACTION_ID to your incognito action (e.g. action_...)."
        );
        return;
      }

      setIsVerifying(true);
      try {
        const { finalPayload } = await MiniKit.commandsAsync.verify(verifyPayload);

        if (finalPayload.status === "error") {
          toast.error("World ID verification was cancelled.");
          return;
        }

        const successPayload = finalPayload as ISuccessResult;

        const response = await fetch("/api/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            payload: successPayload,
            action: actionId,
            signal: verifyPayload.signal,
          }),
        });

        const verificationResponse = (await response.json().catch(() => ({}))) as
          | { status?: number; error?: string; verifyRes?: { code?: string; detail?: string } }
          | undefined;

        if (!response.ok || verificationResponse?.status !== 200) {
          const reason =
            verificationResponse?.error ||
            verificationResponse?.verifyRes?.code ||
            verificationResponse?.verifyRes?.detail ||
            "Server-side verification failed";
          throw new Error(reason);
        }

        setVerification({
          nullifierHash: successPayload.nullifier_hash,
          merkleRoot: successPayload.merkle_root,
          proof: successPayload.proof,
          verificationLevel: (successPayload.verification_level || "orb").toLowerCase() as "orb" | "device",
          actionId,
        });

        toast.success("World ID verification successful.");
      } catch (error) {
        console.error("World ID verification failed", error);
        const message = error instanceof Error ? error.message : "World ID verification failed";
        toast.error(message);
      } finally {
        setIsVerifying(false);
      }
    },
    []
  );

  const resetVerification = useCallback(() => {
    setVerification(null);
  }, []);

  const identityKey = useMemo(() => verification?.nullifierHash ?? "guest", [verification?.nullifierHash]);

  const contextValue = useMemo<WorldAppContextValue>(
    () => ({
      worldAppStatus,
      isVerified: !!verification,
      isVerifying,
      verification,
      identityKey,
      verifyHuman,
      resetVerification,
    }),
    [worldAppStatus, verification, isVerifying, identityKey, verifyHuman, resetVerification]
  );

  return <WorldAppContext.Provider value={contextValue}>{children}</WorldAppContext.Provider>;
}

export function useWorldApp() {
  const context = useContext(WorldAppContext);
  if (!context) {
    throw new Error("useWorldApp must be used within a WorldAppProvider");
  }
  return context;
}
