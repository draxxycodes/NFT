"use client";

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, TrendingUp, User, Wallet, Globe, Eye, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { NFT, Collection } from '@/lib/types';
import { worldChainAPI } from '@/lib/worldchain-api';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type SortOption = 'newest' | 'oldest' | 'name' | 'rarity';

export default function NFTExplorer() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('explore');

  // Load trending collections on component mount
  useEffect(() => {
    loadTrendingCollections();
  }, []);

  const loadTrendingCollections = async () => {
    try {
      const trending = await worldChainAPI.getTrendingCollections();
      setCollections(trending);
    } catch (error) {
      console.error('Failed to load trending collections:', error);
      toast.error('Failed to load trending collections');
    }
  };

  const searchNFTs = async (address: string) => {
    if (!address.trim()) {
      toast.error('Please enter a wallet address');
      return;
    }

    setLoading(true);
    try {
      const userNFTs = await worldChainAPI.getNFTsByOwner(address);
      setNfts(userNFTs);
      setWalletAddress(address);
      setActiveTab('collection');
      toast.success(`Found ${userNFTs.length} NFTs`);
    } catch (error) {
      console.error('Failed to search NFTs:', error);
      toast.error('Failed to search NFTs');
    } finally {
      setLoading(false);
    }
  };

  const loadCollectionNFTs = async (contractAddress: string) => {
    setLoading(true);
    try {
      const collectionNFTs = await worldChainAPI.getNFTsByCollection(contractAddress);
      setNfts(collectionNFTs);
      setActiveTab('collection');
      toast.success(`Loaded ${collectionNFTs.length} NFTs from collection`);
    } catch (error) {
      console.error('Failed to load collection NFTs:', error);
      toast.error('Failed to load collection NFTs');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort NFTs
  const filteredAndSortedNFTs = nfts
    .filter(nft => 
      nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.collection?.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(nft => 
      selectedCollection === 'all' || nft.contractAddress === selectedCollection
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rarity':
          return (b.rarity?.score || 0) - (a.rarity?.score || 0);
        default:
          return 0;
      }
    });

  const uniqueCollections = Array.from(
    new Map(nfts.map(nft => [nft.contractAddress, nft.collection])).values()
  ).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">NFT Explorer</h1>
              <p className="text-gray-400">Discover and explore NFTs on World Chain</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="text-white"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="text-white"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by wallet address (0x...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  onKeyDown={(e) => e.key === 'Enter' && searchNFTs(searchQuery)}
                />
              </div>
            </div>
            <Button 
              onClick={() => searchNFTs(searchQuery)} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Searching...' : 'Search NFTs'}
            </Button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => searchNFTs('0x742d35Cc6634C0532925a3b8D9c9084dbC27A95b')}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <User className="h-3 w-3 mr-1" />
              Demo Wallet 1
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => searchNFTs('0x8ba1f109551bD432803012645Hac136c0c8083B4')}
              className="text-white border-white/20 hover:bg-white/10"
            >
              <User className="h-3 w-3 mr-1" />
              Demo Wallet 2
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="explore" className="text-white">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending Collections
            </TabsTrigger>
            <TabsTrigger value="collection" className="text-white">
              <Wallet className="h-4 w-4 mr-2" />
              Your NFTs ({nfts.length})
            </TabsTrigger>
          </TabsList>

          {/* Trending Collections Tab */}
          <TabsContent value="explore" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((collection) => (
                <Card key={collection.contractAddress} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer" onClick={() => loadCollectionNFTs(collection.contractAddress)}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={collection.image} alt={collection.name} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {collection.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg mb-1">{collection.name}</h3>
                        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{collection.description}</p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Floor:</span>
                            <p className="text-white font-medium">{collection.floorPrice || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Volume:</span>
                            <p className="text-white font-medium">{collection.volumeTraded || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* User Collection Tab */}
          <TabsContent value="collection" className="mt-6">
            {nfts.length > 0 && (
              <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedCollection} onValueChange={setSelectedCollection}>
                    <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="All Collections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Collections</SelectItem>
                      {uniqueCollections.map((collection) => (
                        <SelectItem key={collection!.contractAddress} value={collection!.contractAddress}>
                          {collection!.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="rarity">Rarity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Filter className="h-4 w-4" />
                  <span>{filteredAndSortedNFTs.length} NFTs</span>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : filteredAndSortedNFTs.length > 0 ? (
              <div className={cn(
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                  : 'space-y-4'
              )}>
                {filteredAndSortedNFTs.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    viewMode={viewMode}
                    onClick={() => setSelectedNFT(nft)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No NFTs Found</h3>
                  <p className="text-gray-400">
                    {walletAddress 
                      ? 'This wallet doesn\'t own any NFTs on World Chain.' 
                      : 'Enter a wallet address to explore NFTs.'
                    }
                  </p>
                </div>
                <Button onClick={() => searchNFTs('0x742d35Cc6634C0532925a3b8D9c9084dbC27A95b')} className="bg-blue-600 hover:bg-blue-700">
                  Try Demo Wallet
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* NFT Detail Modal */}
        {selectedNFT && (
          <NFTDetailModal
            nft={selectedNFT}
            isOpen={!!selectedNFT}
            onClose={() => setSelectedNFT(null)}
          />
        )}
      </div>
    </div>
  );
}

// NFT Card Component
interface NFTCardProps {
  nft: NFT;
  viewMode: ViewMode;
  onClick: () => void;
}

function NFTCard({ nft, viewMode, onClick }: NFTCardProps) {
  if (viewMode === 'list') {
    return (
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer" onClick={onClick}>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <img 
              src={nft.image} 
              alt={nft.name}
              className="h-16 w-16 rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64?text=NFT';
              }}
            />
            <div className="flex-1">
              <h3 className="text-white font-semibold">{nft.name}</h3>
              <p className="text-gray-400 text-sm">{nft.collection?.name}</p>
              <p className="text-gray-300 text-sm mt-1 line-clamp-2">{nft.description}</p>
            </div>
            <div className="text-right">
              <Badge variant="secondary" className="mb-2">#{nft.tokenId}</Badge>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-gray-400" />
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all cursor-pointer group overflow-hidden" onClick={onClick}>
      <div className="aspect-square overflow-hidden">
        <img 
          src={nft.image} 
          alt={nft.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=NFT';
          }}
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="text-white font-semibold text-lg truncate">{nft.name}</h3>
          <p className="text-gray-400 text-sm">{nft.collection?.name}</p>
        </div>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="text-xs">#{nft.tokenId}</Badge>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-gray-400" />
            <Eye className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// NFT Detail Modal Component
interface NFTDetailModalProps {
  nft: NFT;
  isOpen: boolean;
  onClose: () => void;
}

function NFTDetailModal({ nft, isOpen, onClose }: NFTDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl">{nft.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square overflow-hidden rounded-lg">
            <img 
              src={nft.image} 
              alt={nft.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=NFT';
              }}
            />
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-300">{nft.description || 'No description available.'}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Collection</h3>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600">
                    {nft.collection?.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{nft.collection?.name}</p>
                  <p className="text-gray-400 text-sm">{nft.collection?.symbol}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Token ID:</span>
                  <span>#{nft.tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Contract:</span>
                  <span className="font-mono text-xs">{nft.contractAddress.slice(0, 8)}...{nft.contractAddress.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Owner:</span>
                  <span className="font-mono text-xs">{nft.owner.slice(0, 8)}...{nft.owner.slice(-8)}</span>
                </div>
              </div>
            </div>

            {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Attributes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {nft.metadata.attributes.map((attr, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-3 text-center">
                      <p className="text-gray-400 text-xs uppercase tracking-wide">{attr.trait_type}</p>
                      <p className="font-semibold mt-1">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={() => window.open(`https://worldscan.org/address/${nft.contractAddress}`, '_blank')}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}