import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function GET() {
  const nonce = randomUUID().replace(/-/g, '');
  return NextResponse.json({ nonce });
}
