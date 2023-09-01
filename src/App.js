import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { fantomTestnet } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import Home from './components/Profile'
import './App.css';
import {Buffer} from 'buffer';
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [fantomTestnet],
  [alchemyProvider({ apiKey: 'VwMTYc6YI61GLKKJvxrrrB1o2hugcoY-' }), publicProvider()],
)
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ 
      chains,
      options:{
        shimDisconnect: true,
        UNSTABLE_shimOnConnectSelectAccount: true,
      }
     }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'spearmint',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: 'aa9c77562bd1a7d54e2e2cc54dd25f94'
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

// Pass config to React Context Provider
window.Buffer = window.Buffer || require("buffer").Buffer;

function App() {
  return (
    <WagmiConfig config={config}>
      <Home />
    </WagmiConfig>
  )
}

export default App