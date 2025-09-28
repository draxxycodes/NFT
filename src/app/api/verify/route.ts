import { NextRequest, NextResponse } from 'next/server';
import { verifyCloudProof, type IVerifyResponse, type ISuccessResult } from '@worldcoin/minikit-js';
import { WORLD_CONFIG } from '@/lib/types';

interface IRequestPayload {
  payload: ISuccessResult;
  action: string;
  signal?: string;
}

function resolveAppId(): `app_${string}` {
  const fromEnv = process.env.MINIKIT_APP_ID || process.env.NEXT_PUBLIC_MINIKIT_APP_ID;
  const fallback = WORLD_CONFIG.MINIKIT_APP_ID;
  const candidate = (fromEnv ?? fallback) as string;

  if (!candidate || !candidate.startsWith('app_') || candidate.includes('your_app_id')) {
    throw new Error('Missing or invalid MiniKit app ID. Set MINIKIT_APP_ID to your app identifier.');
  }

  return candidate as `app_${string}`;
}

export async function POST(req: NextRequest) {
  let payload: ISuccessResult | undefined;
  let action: string | undefined;
  let signal: string | undefined;

  try {
    const body = (await req.json()) as Partial<IRequestPayload>;
    payload = body.payload;
    action = body.action;
    signal = body.signal;
  } catch (error) {
    return NextResponse.json({ status: 400, error: 'invalid_json' }, { status: 400 });
  }

  if (!payload || !action) {
    return NextResponse.json({ status: 400, error: 'missing_params' }, { status: 400 });
  }

  if (!action.startsWith('action_')) {
    return NextResponse.json({ status: 400, error: 'invalid_action_id' }, { status: 400 });
  }

  try {
    const appId = resolveAppId();
    const verifyRes = (await verifyCloudProof(payload, appId, action, signal)) as IVerifyResponse;

    if (verifyRes.success) {
      return NextResponse.json({ status: 200, verifyRes });
    }

    return NextResponse.json({ status: 400, verifyRes });
  } catch (error) {
    console.error('World ID verification error', error);
    return NextResponse.json({ status: 500, error: 'verification_failed' }, { status: 500 });
  }
}
