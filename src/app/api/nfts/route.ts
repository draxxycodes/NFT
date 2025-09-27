import { NextRequest, NextResponse } from 'next/server';
import { worldChainAPI } from '@/lib/worldchain-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  
  if (!address) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
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

    return NextResponse.json({
      success: true,
      data: results,
      total: results.reduce((acc, result) => 
        result.success ? acc + result.nfts.length : acc, 0
      ),
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