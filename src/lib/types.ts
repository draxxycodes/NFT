// Configuration for World Chain and MiniKit integration
export const WORLD_CONFIG = {
  // World Chain RPC configuration
  WORLD_CHAIN_RPC: 'https://worldchain-mainnet.g.alchemy.com/v2/2K2RW2ZGDMX4BV7VUBYCMME1TPRF61QRRV',
  WORLD_CHAIN_ID: 480, // World Chain mainnet
  
  // MiniKit App ID (you'll need to replace this with your actual app ID)
  MINIKIT_APP_ID: 'app_staging_your_app_id',
  
  // Public URL (used for deep links). Prefer env, fallback to ngrok.
  PUBLIC_URL: (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BASE_URL) || 'https://a219b02c4939.ngrok-free.app',
  WORLD_APP_DEEPLINK_PREFIX: 'worldapp://mini-app?url=',
  
  // NFT Contract addresses on World Chain
  POPULAR_NFT_CONTRACTS: [
    {
      name: 'World ID Genesis',
      address: '0x...',
      description: 'The genesis collection for World ID holders'
    },
    {
      name: 'World Chain Art',
      address: '0x...',
      description: 'Curated art collection on World Chain'
    }
  ],
  
  // IPFS Gateway for metadata
  IPFS_GATEWAY: 'https://gateway.pinata.cloud/ipfs/',
  
  // Block explorer
  BLOCK_EXPLORER: 'https://worldscan.org',
};

// NFT Standard interfaces
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  animation_url?: string;
  external_url?: string;
}

export interface NFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  owner: string;
  name: string;
  description?: string;
  image: string;
  metadata?: NFTMetadata;
  collection?: {
    name: string;
    symbol: string;
    contractAddress: string;
  };
  rarity?: {
    rank: number;
    score: number;
  };
  lastSale?: {
    price: string;
    currency: string;
    timestamp: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  name: string;
  symbol: string;
  contractAddress: string;
  description?: string;
  image?: string;
  totalSupply?: number;
  floorPrice?: string;
  volumeTraded?: string;
  ownersCount?: number;
}

// World Chain specific types
export interface WorldChainTransaction {
  hash: string;
  blockNumber: number;
  timestamp: number;
  from: string;
  to: string;
  value: string;
  gasUsed: string;
  status: 'success' | 'failed' | 'pending';
}

export interface WorldIDVerification {
  nullifierHash: string;
  merkleRoot: string;
  proof: string;
  verificationLevel: 'orb' | 'device';
  actionId: string;
}