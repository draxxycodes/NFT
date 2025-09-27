import { NextRequest, NextResponse } from 'next/server';
import { worldChainAPI } from '@/lib/worldchain-api';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contractAddress = searchParams.get('contract');
  
  try {
    if (contractAddress) {
      // Get specific collection
      const collection = await worldChainAPI.getCollectionInfo(contractAddress);
      const nfts = await worldChainAPI.getNFTsByCollection(contractAddress);
      
      return NextResponse.json({
        success: true,
        data: {
          ...collection,
          nfts: nfts.slice(0, 20), // Limit to first 20 NFTs
          totalNFTs: nfts.length,
        },
      });
    } else {
      // Get trending collections
      const collections = await worldChainAPI.getTrendingCollections();
      
      return NextResponse.json({
        success: true,
        data: collections,
        count: collections.length,
      });
    }
  } catch (error) {
    console.error('Error fetching collections:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch collections',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}