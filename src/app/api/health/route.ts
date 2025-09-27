import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    name: 'NFT Explorer Mini App',
    env: process.env.NODE_ENV,
    timestamp: Date.now(),
  });
}
