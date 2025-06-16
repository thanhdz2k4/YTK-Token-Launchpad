// Contract addresses for different networks
const NETWORKS = {
    // Local Hardhat Network
    localhost: {
        LAUNCHPAD_ADDRESS: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        TOKEN_ADDRESS: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        CHAIN_ID: 31337,
        RPC_URL: "http://127.0.0.1:8545"
    },
    
    // Sepolia Testnet (Ethereum)
    sepolia: {
        LAUNCHPAD_ADDRESS: "0x0000000000000000000000000000000000000000", // Update after deploy
        TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000", // Update after deploy
        CHAIN_ID: 11155111,
        RPC_URL: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY"
    },
    
    // Goerli Testnet (Ethereum)
    goerli: {
        LAUNCHPAD_ADDRESS: "0x0000000000000000000000000000000000000000", // Update after deploy
        TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000", // Update after deploy
        CHAIN_ID: 5,
        RPC_URL: "https://goerli.infura.io/v3/YOUR_INFURA_KEY"
    },
    
    // Polygon Mumbai Testnet
    mumbai: {
        LAUNCHPAD_ADDRESS: "0x0000000000000000000000000000000000000000", // Update after deploy
        TOKEN_ADDRESS: "0x0000000000000000000000000000000000000000", // Update after deploy
        CHAIN_ID: 80001,
        RPC_URL: "https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY"
    }
};

// Auto-detect network or default to localhost
function getCurrentNetwork() {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return NETWORKS.localhost;
    } else {
        // For production, use Sepolia testnet
        return NETWORKS.sepolia;
    }
}

// Export current network config
const CURRENT_NETWORK = getCurrentNetwork();
const LAUNCHPAD_ADDRESS = CURRENT_NETWORK.LAUNCHPAD_ADDRESS;
const TOKEN_ADDRESS = CURRENT_NETWORK.TOKEN_ADDRESS;

// Contract ABIs (same as before)
const LAUNCHPAD_ABI = [
    "function owner() view returns (address)",
    "function token() view returns (address)",
    "function rate() view returns (uint256)",
    "function startTime() view returns (uint256)",
    "function endTime() view returns (uint256)",
    "function hardCap() view returns (uint256)",
    "function totalRaised() view returns (uint256)",
    "function contributions(address) view returns (uint256)",
    "function buyTokens() payable",
    "function withdraw()",
    "event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount)"
];

const TOKEN_ABI = [
    "function name() view returns (string)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "event Transfer(address indexed from, address indexed to, uint256 value)"
];

// ...existing code... (rest of app.js remains the same)
