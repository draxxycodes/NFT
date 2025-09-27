import { NextRequest, NextResponse } from 'next/server';

// Minimal stub for World ID verification to unblock Mini App testing.
// In production, validate the proof with World server per docs.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { nullifierHash, merkleRoot, proof, actionId, verificationLevel } = body || {};

    if (!nullifierHash || !proof) {
      return NextResponse.json({ ok: false, error: 'missing_params' }, { status: 400 });
    }

    // TODO: Server-side validation against World verifier service.
    const result = {
      ok: true,
      verified: true,
      actionId: actionId || 'demo-action',
      verificationLevel: verificationLevel || 'device',
      nullifierHash,
      merkleRoot: merkleRoot || null,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
