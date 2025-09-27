import { WORLD_CONFIG, NFT, Collection, NFTMetadata } from './types';

export class WorldChainAPI {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = 'https://worldchain-mainnet.g.alchemy.com/v2';
    this.apiKey = '2K2RW2ZGDMX4BV7VUBYCMME1TPRF61QRRV';
  }

  // Fetch NFTs owned by a specific address
  async getNFTsByOwner(ownerAddress: string): Promise<NFT[]> {
    try {
      const url = `${this.apiUrl}/${this.apiKey}/getNFTs?owner=${ownerAddress}&withMetadata=true`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.ownedNfts) {
        return [];
      }

      return data.ownedNfts.map((nft: any) => this.formatNFT(nft));
    } catch (error) {
      console.error('Error fetching NFTs by owner:', error);
      // Return sample data for demo purposes
      return this.getSampleNFTs(ownerAddress);
    }
  }

  // Fetch NFT metadata by contract and token ID
  async getNFTMetadata(contractAddress: string, tokenId: string): Promise<NFT | null> {
    try {
      const url = `${this.apiUrl}/${this.apiKey}/getNFTMetadata?contractAddress=${contractAddress}&tokenId=${tokenId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.formatNFT(data);
    } catch (error) {
      console.error('Error fetching NFT metadata:', error);
      return null;
    }
  }

  // Search for NFTs by collection
  async getNFTsByCollection(contractAddress: string): Promise<NFT[]> {
    try {
      const url = `${this.apiUrl}/${this.apiKey}/getNFTsForCollection?contractAddress=${contractAddress}&withMetadata=true`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.nfts ? data.nfts.map((nft: any) => this.formatNFT(nft)) : [];
    } catch (error) {
      console.error('Error fetching NFTs by collection:', error);
      return [];
    }
  }

  // Get collection information
  async getCollectionInfo(contractAddress: string): Promise<Collection | null> {
    try {
      const url = `${this.apiUrl}/${this.apiKey}/getContractMetadata?contractAddress=${contractAddress}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.formatCollection(data.contractMetadata);
    } catch (error) {
      console.error('Error fetching collection info:', error);
      return null;
    }
  }

  // Format NFT data from API response
  private formatNFT(apiNft: any): NFT {
    const metadata = apiNft.metadata || {};
    const contractMetadata = apiNft.contract || {};
    
    return {
      id: `${apiNft.contract?.address || 'unknown'}_${apiNft.id?.tokenId || apiNft.tokenId || '0'}`,
      tokenId: apiNft.id?.tokenId || apiNft.tokenId || '0',
      contractAddress: apiNft.contract?.address || apiNft.contractAddress || '',
      owner: apiNft.owner || '',
      name: metadata.name || `${contractMetadata.name || 'Unknown'} #${apiNft.id?.tokenId || apiNft.tokenId || '0'}`,
      description: metadata.description || '',
      image: this.resolveIPFS(metadata.image || ''),
      metadata: {
        name: metadata.name || '',
        description: metadata.description || '',
        image: this.resolveIPFS(metadata.image || ''),
        attributes: metadata.attributes || [],
        animation_url: metadata.animation_url ? this.resolveIPFS(metadata.animation_url) : undefined,
        external_url: metadata.external_url,
      },
      collection: contractMetadata ? {
        name: contractMetadata.name || 'Unknown Collection',
        symbol: contractMetadata.symbol || 'UNKNOWN',
        contractAddress: contractMetadata.address || apiNft.contract?.address || '',
      } : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Format collection data from API response
  private formatCollection(apiCollection: any): Collection {
    return {
      name: apiCollection.name || 'Unknown Collection',
      symbol: apiCollection.symbol || 'UNKNOWN',
      contractAddress: apiCollection.address || '',
      description: apiCollection.description,
      image: this.resolveIPFS(apiCollection.image || ''),
      totalSupply: apiCollection.totalSupply,
    };
  }

  // Resolve IPFS URLs to gateway URLs
  private resolveIPFS(url: string): string {
    if (!url) return '';
    if (url.startsWith('ipfs://')) {
      return url.replace('ipfs://', WORLD_CONFIG.IPFS_GATEWAY);
    }
    return url;
  }

  // Sample NFT data for demo purposes
  private getSampleNFTs(ownerAddress: string): NFT[] {
    return [
      {
        id: 'sample-1',
        tokenId: '1',
        contractAddress: '0x1234567890123456789012345678901234567890',
        owner: ownerAddress,
        name: 'Cosmic Wanderer #001',
        description: 'A celestial being exploring the vastness of World Chain.',
        image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=800&q=80',
        metadata: {
          name: 'Cosmic Wanderer #001',
          description: 'A celestial being exploring the vastness of World Chain.',
          image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?auto=format&fit=crop&w=800&q=80',
          attributes: [
            { trait_type: 'Background', value: 'Nebula' },
            { trait_type: 'Rarity', value: 'Legendary' },
            { trait_type: 'Power Level', value: 95 },
          ],
        },
        collection: {
          name: 'Cosmic Wanderers',
          symbol: 'CW',
          contractAddress: '0x1234567890123456789012345678901234567890',
        },
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'sample-2',
        tokenId: '42',
        contractAddress: '0x2345678901234567890123456789012345678901',
        owner: ownerAddress,
        name: 'Digital Phoenix #42',
        description: 'Rising from the ashes of traditional finance, this phoenix represents the rebirth of ownership.',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
        metadata: {
          name: 'Digital Phoenix #42',
          description: 'Rising from the ashes of traditional finance, this phoenix represents the rebirth of ownership.',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
          attributes: [
            { trait_type: 'Element', value: 'Fire' },
            { trait_type: 'Wings', value: 'Crystalline' },
            { trait_type: 'Rarity', value: 'Epic' },
          ],
        },
        collection: {
          name: 'Digital Phoenixes',
          symbol: 'DP',
          contractAddress: '0x2345678901234567890123456789012345678901',
        },
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: 'sample-3',
        tokenId: '7',
        contractAddress: '0x3456789012345678901234567890123456789012',
        owner: ownerAddress,
        name: 'Quantum Garden #7',
        description: 'A mystical garden where digital flowers bloom in quantum superposition.',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80',
        metadata: {
          name: 'Quantum Garden #7',
          description: 'A mystical garden where digital flowers bloom in quantum superposition.',
          image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=800&q=80',
          attributes: [
            { trait_type: 'Season', value: 'Eternal Spring' },
            { trait_type: 'Quantum State', value: 'Superposition' },
            { trait_type: 'Rarity', value: 'Rare' },
          ],
        },
        collection: {
          name: 'Quantum Gardens',
          symbol: 'QG',
          contractAddress: '0x3456789012345678901234567890123456789012',
        },
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ];
  }

  // Get trending collections (mock data for now)
  async getTrendingCollections(): Promise<Collection[]> {
    return [
      {
        name: 'World ID Genesis',
        symbol: 'WIG',
        contractAddress: '0x1111111111111111111111111111111111111111',
        description: 'The genesis collection for World ID verified humans.',
        image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
        totalSupply: 10000,
        floorPrice: '0.1 ETH',
        volumeTraded: '1,250 ETH',
        ownersCount: 3456,
      },
      {
        name: 'World Chain Art',
        symbol: 'WCA',
        contractAddress: '0x2222222222222222222222222222222222222222',
        description: 'Curated digital art on World Chain.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        totalSupply: 5000,
        floorPrice: '0.05 ETH',
        volumeTraded: '876 ETH',
        ownersCount: 2134,
      },
      {
        name: 'Decentralized Dreams',
        symbol: 'DD',
        contractAddress: '0x3333333333333333333333333333333333333333',
        description: 'Dreams visualized through decentralized creativity.',
        image: 'https://images.unsplash.com/photo-1574192324001-ba9265fd9fcf?auto=format&fit=crop&w=800&q=80',
        totalSupply: 7777,
        floorPrice: '0.08 ETH',
        volumeTraded: '654 ETH',
        ownersCount: 1876,
      },
    ];
  }
}

// Singleton instance
export const worldChainAPI = new WorldChainAPI();