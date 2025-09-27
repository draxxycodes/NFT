"use client";

import { useState, useEffect } from 'react';
import { worldChainAPI } from '@/lib/worldchain-api';
import { Collection, NFT } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  Users, 
  BarChart3, 
  Search, 
  Eye,
  ExternalLink,
  Crown,
  Star,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface CollectionStats {
  floorPrice: string;
  volumeTraded: string;
  ownersCount: number;
  totalSupply: number;
  trend: 'up' | 'down' | 'stable';
  change24h: string;
}

interface CollectionWithStats extends Collection {
  stats: CollectionStats;
  featured?: boolean;
  verified?: boolean;
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionWithStats[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState<CollectionWithStats | null>(null);
  const [collectionNFTs, setCollectionNFTs] = useState<NFT[]>([]);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      // Get trending collections and enhance with stats
      const trending = await worldChainAPI.getTrendingCollections();
      const enhancedCollections: CollectionWithStats[] = trending.map((collection, index) => ({
        ...collection,
        stats: generateMockStats(),
        featured: index < 3,
        verified: Math.random() > 0.3,
      }));

      setCollections(enhancedCollections);
    } catch (error) {
      console.error('Failed to load collections:', error);
      toast.error('Failed to load collections');
    } finally {
      setLoading(false);
    }
  };

  const loadCollectionDetails = async (collection: CollectionWithStats) => {
    try {
      setSelectedCollection(collection);
      const nfts = await worldChainAPI.getNFTsByCollection(collection.contractAddress);
      setCollectionNFTs(nfts.slice(0, 6)); // Show first 6 NFTs
    } catch (error) {
      console.error('Failed to load collection details:', error);
      toast.error('Failed to load collection details');
    }
  };

  const generateMockStats = (): CollectionStats => {
    const trends = ['up', 'down', 'stable'] as const;
    return {
      floorPrice: `${(Math.random() * 2 + 0.01).toFixed(3)} ETH`,
      volumeTraded: `${(Math.random() * 1000 + 100).toFixed(0)} ETH`,
      ownersCount: Math.floor(Math.random() * 5000 + 500),
      totalSupply: Math.floor(Math.random() * 10000 + 1000),
      trend: trends[Math.floor(Math.random() * trends.length)],
      change24h: `${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 20).toFixed(1)}%`,
    };
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredCollections = filteredCollections.filter(c => c.featured);
  const regularCollections = filteredCollections.filter(c => !c.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Collections</h1>
          <p className="text-gray-400 mb-6">Discover the most popular NFT collections on World Chain</p>
          
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Collections */}
            {featuredCollections.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6">
                  <Crown className="h-5 w-5 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Featured Collections</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredCollections.map((collection) => (
                    <FeaturedCollectionCard
                      key={collection.contractAddress}
                      collection={collection}
                      onClick={() => loadCollectionDetails(collection)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All Collections */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Trending Collections</h2>
                <Badge variant="secondary" className="ml-2">
                  {filteredCollections.length}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {regularCollections.map((collection) => (
                  <CollectionCard
                    key={collection.contractAddress}
                    collection={collection}
                    onClick={() => loadCollectionDetails(collection)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Collection Detail Modal */}
        {selectedCollection && (
          <CollectionModal
            collection={selectedCollection}
            nfts={collectionNFTs}
            isOpen={!!selectedCollection}
            onClose={() => setSelectedCollection(null)}
          />
        )}
      </div>
    </div>
  );
}

// Featured Collection Card Component
interface FeaturedCollectionCardProps {
  collection: CollectionWithStats;
  onClick: () => void;
}

function FeaturedCollectionCard({ collection, onClick }: FeaturedCollectionCardProps) {
  return (
    <Card 
      className="bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20 backdrop-blur-sm border-white/30 hover:border-white/50 transition-all cursor-pointer overflow-hidden group"
      onClick={onClick}
    >
      <div className="relative">
        <div className="aspect-[16/10] overflow-hidden">
          <img 
            src={collection.image} 
            alt={collection.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x250?text=' + encodeURIComponent(collection.name);
            }}
          />
        </div>
        <div className="absolute top-4 right-4">
          <Badge className="bg-yellow-400 text-black font-semibold">
            <Crown className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={collection.image} alt={collection.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg font-bold">
              {collection.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-bold text-lg">{collection.name}</h3>
              {collection.verified && (
                <Badge variant="secondary" className="text-xs">
                  <Star className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-gray-400 text-sm line-clamp-2">{collection.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Floor</p>
            <p className="text-white font-semibold">{collection.stats.floorPrice}</p>
          </div>
          <div>
            <p className="text-gray-400">Volume</p>
            <p className="text-white font-semibold">{collection.stats.volumeTraded}</p>
          </div>
          <div>
            <p className="text-gray-400">Owners</p>
            <p className="text-white font-semibold">{collection.stats.ownersCount.toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Regular Collection Card Component
interface CollectionCardProps {
  collection: CollectionWithStats;
  onClick: () => void;
}

function CollectionCard({ collection, onClick }: CollectionCardProps) {
  return (
    <Card 
      className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <Avatar>
            <AvatarImage src={collection.image} alt={collection.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {collection.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-semibold truncate">{collection.name}</h3>
              {collection.verified && (
                <Star className="h-3 w-3 text-yellow-400 flex-shrink-0" />
              )}
            </div>
            <p className="text-gray-400 text-xs line-clamp-2">{collection.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-400">Floor Price</p>
            <p className="text-white font-medium">{collection.stats.floorPrice}</p>
          </div>
          <div>
            <p className="text-gray-400">24h Change</p>
            <p className={`font-medium ${
              collection.stats.trend === 'up' ? 'text-green-400' : 
              collection.stats.trend === 'down' ? 'text-red-400' : 'text-gray-400'
            }`}>
              {collection.stats.change24h}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Users className="h-3 w-3" />
            <span>{collection.stats.ownersCount}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Activity className="h-3 w-3" />
            <span>{collection.stats.totalSupply}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Collection Detail Modal Component
interface CollectionModalProps {
  collection: CollectionWithStats;
  nfts: NFT[];
  isOpen: boolean;
  onClose: () => void;
}

function CollectionModal({ collection, nfts, isOpen, onClose }: CollectionModalProps) {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed inset-4 bg-slate-900 rounded-2xl border border-white/20 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/20">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={collection.image} alt={collection.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                    {collection.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-white text-2xl font-bold">{collection.name}</h2>
                    {collection.verified && (
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-gray-400 mb-3">{collection.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{collection.stats.ownersCount} owners</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{collection.stats.totalSupply} items</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={onClose} className="text-white border-white/20">
                ✕
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6 border-b border-white/20">
            <div className="grid grid-cols-4 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Floor Price</p>
                <p className="text-white text-xl font-bold">{collection.stats.floorPrice}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Volume Traded</p>
                <p className="text-white text-xl font-bold">{collection.stats.volumeTraded}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">24h Change</p>
                <p className={`text-xl font-bold ${
                  collection.stats.trend === 'up' ? 'text-green-400' : 
                  collection.stats.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {collection.stats.change24h}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Supply</p>
                <p className="text-white text-xl font-bold">{collection.stats.totalSupply.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* NFTs Preview */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white text-lg font-semibold">Recent Items</h3>
              <Button 
                onClick={() => window.open(`https://worldscan.org/address/${collection.contractAddress}`, '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
            </div>
            
            {nfts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {nfts.map((nft) => (
                  <div key={nft.id} className="group cursor-pointer">
                    <div className="aspect-square bg-white/5 rounded-lg overflow-hidden mb-2">
                      <img 
                        src={nft.image} 
                        alt={nft.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200x200?text=NFT';
                        }}
                      />
                    </div>
                    <p className="text-white text-sm font-medium truncate">{nft.name}</p>
                    <p className="text-gray-400 text-xs">#{nft.tokenId}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No items found in this collection</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}