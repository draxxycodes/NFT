# World Chain NFT Explorer Mini App

A comprehensive NFT explorer mini app built for World Chain with World ID integration. This application allows users to discover, explore, and interact with NFTs on World Chain while leveraging World ID verification for enhanced security and exclusive features.

## 🌟 Features

### Core Functionality
- **NFT Discovery**: Search and explore NFTs by wallet address or collection
- **Collection Browser**: Discover trending NFT collections with detailed statistics
- **Advanced Filtering**: Filter by collection, rarity, price, and more
- **Detailed NFT Views**: View comprehensive NFT metadata, attributes, and history
- **Multiple View Modes**: Grid and list view options for optimal browsing

### World ID Integration
- **Human Verification**: Verify your humanity with World ID for exclusive access
- **Anti-Bot Protection**: Ensure authentic human participation in NFT activities  
- **Verified Collections**: Access to verified-human-only NFT collections
- **Enhanced Security**: Secure transactions with verified identity

### World Chain Native
- **Optimized for World Chain**: Built specifically for World Chain's infrastructure
- **Low Gas Fees**: Take advantage of World Chain's efficient transaction costs
- **Fast Transactions**: Quick confirmation times for smooth user experience
- **Native Token Support**: Support for WLD, USDC, and ETH on World Chain

### Mini App Features
- **World App Integration**: Runs natively within World App
- **MiniKit SDK**: Utilizes World's MiniKit for seamless mobile experience
- **Wallet Connection**: Easy wallet connection with MetaMask and World App wallet
- **Notifications**: Push notifications for important updates (World App only)
- **Payment Integration**: Built-in payment functionality for NFT transactions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- World App (for full mini app experience)
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NFT
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Configure the following variables:
   ```env
   VITE_WORLD_CHAIN_API_KEY=your_alchemy_api_key
   VITE_WORLD_CHAIN_API_URL=https://worldchain-mainnet.g.alchemy.com/v2
   NEXT_PUBLIC_MINIKIT_APP_ID=your_minikit_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### For World App (Mini App)
1. **Install World App** from App Store or Google Play
2. **Open the app** in World App using the mini app URL
3. **Verify with World ID** for full functionality

## 🏗️ Project Structure

```
src/
├── app/                      # Next.js 15 app directory
│   ├── collections/          # Collections browser page
│   ├── explore/              # Main NFT explorer page  
│   ├── vault/                # User's NFT collection
│   ├── layout.tsx            # Root layout with navigation
│   └── page.tsx              # Homepage
├── components/               # Reusable React components
│   ├── ui/                   # shadcn/ui components
│   ├── NFTExplorer.tsx       # Main NFT explorer component
│   ├── WorldIDConnector.tsx  # World ID authentication
│   ├── MiniAppIntegration.tsx # World App mini app features
│   └── MintFirstNFT.tsx      # NFT minting demo
├── lib/                      # Utilities and configurations
│   ├── types.ts              # TypeScript type definitions
│   ├── worldchain-api.ts     # World Chain API integration
│   └── utils.ts              # Utility functions
└── hooks/                    # Custom React hooks
```

## 🔧 Key Components

### NFTExplorer
The main component providing comprehensive NFT browsing functionality:
- Search NFTs by wallet address
- Browse trending collections
- Filter and sort capabilities
- Detailed NFT modal views

### WorldIDConnector  
Handles World ID authentication and verification:
- Connect wallet functionality
- World ID verification flow
- Display verification status
- Access to exclusive features

### MiniAppIntegration
Manages World App mini app specific features:
- Detect World App environment
- MiniKit SDK integration
- Feature availability status
- Demo mode for web browsers

### CollectionsPage
Dedicated page for browsing NFT collections:
- Featured collections showcase
- Collection statistics and metrics
- Search and filtering options
- Collection detail modals

## 🌐 API Integration

### World Chain API
- **Alchemy Integration**: Uses Alchemy's enhanced APIs for World Chain
- **NFT Metadata**: Fetch comprehensive NFT metadata and images
- **Collection Data**: Get collection statistics and information
- **Real-time Data**: Up-to-date pricing and ownership information

### World ID API
- **Verification**: Integrate World ID proof generation and verification
- **Incognito Actions**: Support for privacy-preserving actions
- **Human Verification**: Ensure authentic human participation

## 🎨 Design & UX

### Visual Design
- **Modern UI**: Clean, modern interface with glassmorphism effects
- **Dark Theme**: Optimized dark theme for better viewing experience
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Animations**: Smooth transitions and hover effects

### User Experience
- **Progressive Enhancement**: Works in browsers, enhanced in World App
- **Demo Mode**: Full functionality even without World App
- **Error Handling**: Graceful error handling with user feedback
- **Loading States**: Clear loading indicators for all async operations

## 🔐 Security Features

### World ID Integration
- **Sybil Resistance**: Prevent bot manipulation with human verification
- **Privacy-First**: Zero-knowledge proofs protect user privacy
- **Verification Levels**: Support for both Orb and Device verification
- **Action Limiting**: Prevent spam with verified action limits

### Smart Contract Security
- **Address Whitelisting**: Verify interaction with legitimate contracts only
- **Transaction Simulation**: Preview transactions before execution
- **Gas Optimization**: Efficient gas usage for cost-effective operations

## 📱 Mini App Deployment

### Development
1. **Configure MiniKit**: Set up your mini app in the World Developer Portal
2. **Test in World App**: Use the World App simulator for testing
3. **Deploy**: Deploy your app to a public URL

### Production
1. **Domain Setup**: Configure your production domain
2. **MiniKit Registration**: Register your mini app with World
3. **App Store Submission**: Submit to World App marketplace

## 🧪 Testing

### Local Testing
```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run lint          # Code linting
npm run type-check    # TypeScript checking
```

### World App Testing
1. Open World App simulator
2. Navigate to your local development URL
3. Test all mini app features
4. Verify World ID integration

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Other Platforms
- **Netlify**: `npm run build` + static deploy
- **Railway**: Direct GitHub integration
- **AWS Amplify**: Full-stack deployment option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **World Chain**: [https://worldchain.org](https://worldchain.org)
- **World ID**: [https://worldcoin.org/world-id](https://worldcoin.org/world-id)  
- **World App**: [https://worldapp.org](https://worldapp.org)
- **Documentation**: [https://docs.world.org](https://docs.world.org)
- **MiniKit Docs**: [https://docs.world.org/mini-apps](https://docs.world.org/mini-apps)

## 💡 Key Features Explained

### World ID Verification Benefits
- **Exclusive Collections**: Access verified-human-only NFT drops
- **Anti-Manipulation**: Prevent bot farming and market manipulation  
- **Authentic Communities**: Build genuine communities around collectibles
- **Verified Trading**: Trade with confidence knowing counterparts are human

### Mini App Advantages  
- **Native Experience**: Feels like a native mobile app within World App
- **Integrated Wallet**: Seamless connection to World App's built-in wallet
- **Push Notifications**: Stay updated on collection activity and opportunities
- **Social Features**: Share discoveries with the World App community

### Technical Highlights
- **Next.js 15**: Latest React framework with app directory structure
- **TypeScript**: Full type safety throughout the application  
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible component library
- **Real-time Data**: Live NFT and collection data from World Chain

This NFT Explorer represents the future of human-centric web3 applications, combining the power of blockchain technology with the assurance of human verification through World ID.
