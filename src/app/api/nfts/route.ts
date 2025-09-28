import { NextRequest, NextResponse } from 'next/server';
import { worldChainAPI } from '@/lib/worldchain-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json(
      { error: 'World Chain address is required' },
      { status: 400 }
    );
  }

  try {
    const nfts = await worldChainAPI.getNFTsByOwner(address);
    
    return NextResponse.json({
      success: true,
      data: nfts,
      count: nfts.length,
      address,
    });
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch NFTs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { addresses } = body;

    if (!addresses || !Array.isArray(addresses)) {
      return NextResponse.json(
        { error: 'Addresses array is required' },
        { status: 400 }
      );
    }

    // Fetch NFTs for multiple addresses
    const results = await Promise.all(
      addresses.map(async (address: string) => {
        try {
          const nfts = await worldChainAPI.getNFTsByOwner(address);
          return { address, nfts, success: true };
        } catch (error) {
          return { 
            address, 
            error: error instanceof Error ? error.message : 'Unknown error',
            success: false 
          };
        }
      })
    );

    const total = results.reduce((acc: number, result) => {
      if (result.success && Array.isArray(result.nfts)) {
        return acc + result.nfts.length;
      }
      return acc;
    }, 0);

    return NextResponse.json({
      success: true,
      data: results,
      total,
    });
  } catch (error) {
    console.error('Error in batch NFT fetch:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to batch fetch NFTs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}