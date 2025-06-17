(function() {
'use strict';

// Network Configuration
const NETWORK_CONFIG = {
    chainId: '0xaa36a7', // Sepolia testnet
    chainName: 'Sepolia Test Network',
    nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: ['https://sepolia.infura.io/v3/'],
    blockExplorerUrls: ['https://sepolia.etherscan.io/']
};

// Contract addresses for Sepolia testnet (YOUR DEPLOYED CONTRACTS)
let LAUNCHPAD_ADDRESS = "0x96748C4718Bd81Ca418f5ec0A32dfc8a916e8Ae8"; // Your LaunchpadAuto contract
let TOKEN_ADDRESS = "0xF34DF1B06875AB34Da7F5E4FFC79a1Dc07F3289a"; // Your YourTokenSimple contract

// Test mode - set to false for real blockchain data
const TEST_MODE = false;

// Contract ABIs
const LAUNCHPAD_ABI = [
    {
        "inputs": [],
        "name": "buyTokens",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "emergencyWithdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_rate",
                "type": "uint256"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "ReentrancyGuardReentrantCall",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "FundsWithdrawn",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [],
        "name": "SaleFinalized",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "ethAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenAmount",
                "type": "uint256"
            }
        ],
        "name": "TokensPurchased",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawFunds",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdrawUnsoldTokens",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "contributions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "contributors",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getContributorCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getSaleInfo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "_rate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_totalRaised",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_hardCap",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_tokensRemaining",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTimeInfo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "currentTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "saleStart",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "saleEnd",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "isActive",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "hardCap",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "startTime",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token",
        "outputs": [
            {
                "internalType": "contract IERC20",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalRaised",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
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

// Global variables
let provider;
let signer;
let launchpadContract;
let tokenContract;
let userAddress;
let userEthBalance;

// DOM elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletStatus = document.getElementById('walletStatus');
const walletStatusText = document.getElementById('walletStatusText');
const ethAmountInput = document.getElementById('ethAmount');
const tokenAmountInput = document.getElementById('tokenAmount');
const buyTokensBtn = document.getElementById('buyTokensBtn');
const checkTokensBtn = document.getElementById('checkTokensBtn');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const totalRaisedSpan = document.getElementById('totalRaised');
const saleStatusDiv = document.getElementById('saleStatus');
const countdownSection = document.getElementById('countdownSection');
const countdownDiv = document.getElementById('countdown');
const ytkBalanceSpan = document.getElementById('ytkBalance');
const ethBalanceSpan = document.getElementById('ethBalance');
const contributionSpan = document.getElementById('contribution');
const contractAddressSpan = document.getElementById('contractAddress');
const userAddressSpan = document.getElementById('userAddress');
const transactionList = document.getElementById('transactionList');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event fired');
    console.log('Document ready, checking elements...');
    
    // Check if all required elements exist
    const elements = {
        connectWalletBtn: document.getElementById('connectWallet'),
        walletStatus: document.getElementById('walletStatus'),
        ethAmountInput: document.getElementById('ethAmount'),
        buyTokensBtn: document.getElementById('buyTokensBtn')
    };
    
    Object.entries(elements).forEach(([name, element]) => {
        if (element) {
            console.log(`✓ ${name} found`);
        } else {
            console.error(`✗ ${name} NOT found`);
        }
    });
    
    checkWalletConnection();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    console.log('Setting up event listeners...');
    console.log('connectWalletBtn:', connectWalletBtn);
    
    if (connectWalletBtn) {
        connectWalletBtn.addEventListener('click', connectWallet);
        console.log('Connect wallet event listener added');
    } else {
        console.error('connectWalletBtn element not found!');
    }
      ethAmountInput.addEventListener('input', calculateTokenAmount);
    buyTokensBtn.addEventListener('click', buyTokens);
    checkTokensBtn.addEventListener('click', checkContractTokens);
}

// Check if wallet is already connected
async function checkWalletConnection() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
                await initializeContracts();
                await updateUI();
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error);
        }
    } else {
        showAlert('Please install MetaMask to use this application', 'warning');
    }
}

// Connect wallet
async function connectWallet() {
    console.log('🔗 Starting wallet connection...');
    console.log('📱 MetaMask available:', typeof window.ethereum !== 'undefined');
    
    if (typeof window.ethereum === 'undefined') {
        console.error('❌ MetaMask not found');
        showAlert('Please install MetaMask', 'warning');
        return;
    }
    
    try {
        console.log('🦊 Requesting MetaMask accounts...');
        showLoading(connectWalletBtn, true);
        
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('✅ Accounts received:', accounts);
        
        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts returned from MetaMask');
        }
        
        // Initialize ethers provider
        console.log('⚙️ Initializing ethers provider...');
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        console.log('✅ User address:', userAddress);
        
        // Get network info
        const network = await provider.getNetwork();
        console.log('🌐 Connected to network:', network.name, 'Chain ID:', network.chainId);
        
        // For now, just show wallet info without worrying about contracts
        console.log('📊 Loading wallet-only demo mode...');
        await updateUIWithWalletOnly();
        
        showAlert('Wallet connected successfully! (Demo mode)', 'success');
        
    } catch (error) {
        console.error('❌ Wallet connection failed:', error);
        showAlert(`Failed to connect wallet: ${error.message}`, 'danger');
    } finally {
        showLoading(connectWalletBtn, false);
    }
}

// Check if user is on correct network
async function checkNetwork() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            console.log('Current chainId:', chainId);
            console.log('Expected chainId:', NETWORK_CONFIG.chainId);
            
            if (chainId !== NETWORK_CONFIG.chainId) {
                showAlert(`Please switch to ${NETWORK_CONFIG.chainName}`, 'warning');
                return false;
            }
            return true;
        } catch (error) {
            console.error('Error checking network:', error);
            return false;
        }
    }
    return false;
}

// Switch to correct network
async function switchNetwork() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: NETWORK_CONFIG.chainId }],
            });
        } catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [NETWORK_CONFIG],
                    });
                } catch (addError) {
                    console.error('Error adding network:', addError);
                    showAlert('Failed to add network', 'danger');
                }
            } else {
                console.error('Error switching network:', switchError);
                showAlert('Failed to switch network', 'danger');
            }
        }
    }
}

// Initialize contracts
async function initializeContracts() {
    try {
        // Initialize provider and signer
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
          // Get network info
        const network = await provider.getNetwork();
        console.log('Connected to network:', network);
        
        console.log('Using contract addresses:');
        console.log('Launchpad Address:', LAUNCHPAD_ADDRESS);
        console.log('Token Address:', TOKEN_ADDRESS);
        
        // Initialize contracts
        launchpadContract = new ethers.Contract(LAUNCHPAD_ADDRESS, LAUNCHPAD_ABI, signer);
        tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
          // Test contract connection
        try {
            console.log('Testing contract connection...');
            const owner = await launchpadContract.owner();
            console.log('✅ Contract owner:', owner);
            console.log('✅ Contracts are live and accessible');
        } catch (contractError) {
            console.error('❌ Contract connection test failed:', contractError);
            
            // Check if it's a network issue or contract doesn't exist
            if (contractError.code === 'CALL_EXCEPTION' || contractError.code === 'NETWORK_ERROR') {
                showAlert('Contracts not found on this network. Using demo mode with real wallet data.', 'warning');
                // Continue without contracts but show real wallet balance
                userEthBalance = await provider.getBalance(userAddress);
                await updateUIWithWalletOnly();
                return;
            } else {
                throw new Error(`Failed to connect to smart contract: ${contractError.message}`);
            }
        }
        
        // Setup event listeners for contract events
        setupContractEventListeners();
        
        console.log('Contracts initialized successfully');
    } catch (error) {
        console.error('Error initializing contracts:', error);
        showAlert(`Contract initialization failed: ${error.message}`, 'danger');
        throw error;
    }
}

// Setup contract event listeners
function setupContractEventListeners() {
    // Listen for token purchases
    launchpadContract.on("TokensPurchased", (buyer, ethAmount, tokenAmount) => {
        console.log('TokensPurchased event:', { buyer, ethAmount, tokenAmount });
        addTransactionToList(buyer, ethAmount, tokenAmount, 'Success');
        updateUI();
    });
}

// Update UI with current data
async function updateUI() {
    try {
        if (TEST_MODE) {
            // Mock data for testing
            console.log('Running in TEST MODE with mock data');
            
            // Update wallet status
            connectWalletBtn.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
            connectWalletBtn.disabled = true;
            walletStatus.style.display = 'block';
            walletStatusText.textContent = `Connected: ${userAddress} (TEST MODE)`;
            walletStatus.className = 'alert alert-info alert-custom';
            
            // Update contract addresses
            contractAddressSpan.textContent = `${LAUNCHPAD_ADDRESS.slice(0, 10)}...${LAUNCHPAD_ADDRESS.slice(-8)}`;
            userAddressSpan.textContent = `${userAddress.slice(0, 10)}...${userAddress.slice(-8)}`;
            
            // Mock contract data
            const mockTotalRaised = "2.5";
            const mockProgress = 25;
            
            // Update progress bar
            progressBar.style.width = `${mockProgress}%`;
            progressText.textContent = `${mockProgress}%`;
            totalRaisedSpan.textContent = mockTotalRaised;
            
            // Update balances (mock)
            ytkBalanceSpan.textContent = `1,000.00 YTK`;
            ethBalanceSpan.textContent = `0.5000 ETH`;
            contributionSpan.textContent = `0.1000 ETH`;
              // Mock sale status
            saleStatusDiv.innerHTML = '<span class="badge bg-success">Sale Active (Mock)</span>';
            
            // Enable buy tokens button in test mode
            buyTokensBtn.disabled = false;
            buyTokensBtn.textContent = 'Buy Tokens (Test)';
            
            // Enable ETH amount input
            ethAmountInput.disabled = false;
            ethAmountInput.placeholder = 'Enter ETH amount (0.01 - 1.0)';
            
            console.log('✅ TEST MODE: UI updated with mock data, buy button enabled');
            
            return;
        }
        
        if (!launchpadContract || !tokenContract) return;
        
        // Update wallet status
        connectWalletBtn.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        connectWalletBtn.disabled = true;
        walletStatus.style.display = 'block';
        walletStatusText.textContent = `Connected: ${userAddress}`;
        walletStatus.className = 'alert alert-success alert-custom';
        
        // Update contract addresses
        contractAddressSpan.textContent = `${LAUNCHPAD_ADDRESS.slice(0, 10)}...${LAUNCHPAD_ADDRESS.slice(-8)}`;
        userAddressSpan.textContent = `${userAddress.slice(0, 10)}...${userAddress.slice(-8)}`;
          // Get contract data with individual error handling
        let totalRaised, hardCap, startTime, endTime, userContribution, userTokenBalance, userEthBalance;
        
        try {
            console.log('Fetching contract data...');
            
            // Test each contract call individually
            totalRaised = await launchpadContract.totalRaised();
            console.log('✓ totalRaised:', totalRaised.toString());
            
            hardCap = await launchpadContract.hardCap();
            console.log('✓ hardCap:', hardCap.toString());
            
            startTime = await launchpadContract.startTime();
            console.log('✓ startTime:', startTime.toString());
            
            endTime = await launchpadContract.endTime();
            console.log('✓ endTime:', endTime.toString());
            
            userContribution = await launchpadContract.contributions(userAddress);
            console.log('✓ userContribution:', userContribution.toString());
            
            userTokenBalance = await tokenContract.balanceOf(userAddress);
            console.log('✓ userTokenBalance:', userTokenBalance.toString());
            
            userEthBalance = await provider.getBalance(userAddress);
            console.log('✓ userEthBalance:', userEthBalance.toString());
            
        } catch (contractCallError) {
            console.error('Contract call failed:', contractCallError);
            showAlert(`Failed to fetch contract data: ${contractCallError.message}`, 'danger');
            return;
        }
        
        // Update progress bar
        const progress = (parseFloat(ethers.utils.formatEther(totalRaised)) / parseFloat(ethers.utils.formatEther(hardCap))) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${progress.toFixed(1)}%`;
        totalRaisedSpan.textContent = parseFloat(ethers.utils.formatEther(totalRaised)).toFixed(3);
        
        // Update balances
        ytkBalanceSpan.textContent = `${parseFloat(ethers.utils.formatEther(userTokenBalance)).toFixed(2)} YTK`;
        ethBalanceSpan.textContent = `${parseFloat(ethers.utils.formatEther(userEthBalance)).toFixed(4)} ETH`;
        contributionSpan.textContent = `${parseFloat(ethers.utils.formatEther(userContribution)).toFixed(4)} ETH`;
        
        // Update sale status and countdown
        updateSaleStatus(startTime.toNumber(), endTime.toNumber());
        
    } catch (error) {
        console.error('Error updating UI:', error);
        showAlert('Error loading data from blockchain', 'danger');
    }
}

// Update UI with real wallet data but mock contract data
async function updateUIWithWalletOnly() {
    try {
        console.log('Updating UI with real wallet data...');
        
        // Update wallet status
        connectWalletBtn.textContent = `${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;
        connectWalletBtn.disabled = true;
        walletStatus.style.display = 'block';
        walletStatusText.textContent = `Connected: ${userAddress} (Demo Mode)`;
        walletStatus.className = 'alert alert-warning alert-custom';
        
        // Update contract addresses
        contractAddressSpan.textContent = `${LAUNCHPAD_ADDRESS.slice(0, 10)}...${LAUNCHPAD_ADDRESS.slice(-8)}`;
        userAddressSpan.textContent = `${userAddress.slice(0, 10)}...${userAddress.slice(-8)}`;
          // Get real ETH balance
        const realEthBalance = await provider.getBalance(userAddress);
        const ethBalanceFormatted = parseFloat(ethers.utils.formatEther(realEthBalance)).toFixed(4);
        
        // Get network info
        const network = await provider.getNetwork();
        console.log('Network:', network.name, 'Chain ID:', network.chainId);
        
        // Mock contract data but show real wallet data
        const mockTotalRaised = "1.5";
        const mockProgress = 15;
        
        // Update progress bar
        progressBar.style.width = `${mockProgress}%`;
        progressText.textContent = `${mockProgress}%`;
        totalRaisedSpan.textContent = mockTotalRaised;
        
        // Update balances (real ETH, mock tokens)
        ytkBalanceSpan.textContent = `0.00 YTK`;
        ethBalanceSpan.textContent = `${ethBalanceFormatted} ETH`;
        contributionSpan.textContent = `0.0000 ETH`;
        
        // Demo sale status
        saleStatusDiv.innerHTML = '<span class="badge bg-warning">Demo Mode - Contracts Not Found</span>';
        
        // Enable buy tokens button but show warning
        buyTokensBtn.disabled = false;
        buyTokensBtn.textContent = 'Buy Tokens (Demo)';
        
        // Enable ETH amount input
        ethAmountInput.disabled = false;
        ethAmountInput.placeholder = 'Enter ETH amount (demo only)';
        
        console.log('✅ Real wallet data loaded:');
        console.log('  - Address:', userAddress);
        console.log('  - ETH Balance:', ethBalanceFormatted);
        console.log('  - Network:', network.name);
        
    } catch (error) {
        console.error('Error updating UI with wallet data:', error);
        showAlert('Error loading wallet data: ' + error.message, 'danger');
    }
}

// Update sale status and countdown
function updateSaleStatus(startTime, endTime) {
    const now = Math.floor(Date.now() / 1000);
    
    if (now < startTime) {
        // Sale hasn't started
        saleStatusDiv.textContent = 'Upcoming';
        saleStatusDiv.className = 'badge bg-warning fs-6 p-2';
        buyTokensBtn.disabled = true;
        
        // Show countdown
        countdownSection.style.display = 'block';
        startCountdown(startTime);
        
    } else if (now >= startTime && now <= endTime) {
        // Sale is active
        saleStatusDiv.textContent = 'Active';
        saleStatusDiv.className = 'badge bg-success fs-6 p-2';
        buyTokensBtn.disabled = false;
        countdownSection.style.display = 'none';
        
    } else {
        // Sale has ended
        saleStatusDiv.textContent = 'Ended';
        saleStatusDiv.className = 'badge bg-danger fs-6 p-2';
        buyTokensBtn.disabled = true;
        countdownSection.style.display = 'none';
    }
}

// Start countdown timer
function startCountdown(targetTime) {
    const countdownTimer = setInterval(() => {
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = targetTime - now;
        
        if (timeLeft <= 0) {
            clearInterval(countdownTimer);
            countdownDiv.textContent = 'Sale Started!';
            updateUI(); // Refresh UI when sale starts
            return;
        }
        
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = timeLeft % 60;
        
        countdownDiv.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Calculate token amount based on ETH input
function calculateTokenAmount() {
    const ethAmount = parseFloat(ethAmountInput.value) || 0;
    const tokenAmount = ethAmount * 1000; // Rate: 1 ETH = 1000 tokens
    tokenAmountInput.value = tokenAmount.toFixed(2);
}

// Check contract status before transaction
async function checkContractStatus() {
    try {
        console.log('🔍 Checking contract status...');
        
        // Check if launchpad has tokens
        const tokenBalance = await tokenContract.balanceOf(LAUNCHPAD_ADDRESS);
        console.log('  - Tokens in Launchpad:', ethers.utils.formatEther(tokenBalance));
        
        // Check sale info
        const saleInfo = await launchpadContract.getSaleInfo();
        console.log('  - Sale Info:', {
            rate: saleInfo._rate.toString(),
            totalRaised: ethers.utils.formatEther(saleInfo._totalRaised),
            hardCap: ethers.utils.formatEther(saleInfo._hardCap),
            tokensRemaining: ethers.utils.formatEther(saleInfo._tokensRemaining)
        });
        
        // Check time info
        const timeInfo = await launchpadContract.getTimeInfo();
        console.log('  - Time Info:', {
            currentTime: new Date(timeInfo.currentTime * 1000).toLocaleString(),
            saleStart: new Date(timeInfo.saleStart * 1000).toLocaleString(),
            saleEnd: new Date(timeInfo.saleEnd * 1000).toLocaleString(),
            isActive: timeInfo.isActive
        });
        
        return {
            hasTokens: tokenBalance.gt(0),
            isActive: timeInfo.isActive,
            tokensRemaining: saleInfo._tokensRemaining
        };
        
    } catch (error) {
        console.error('Error checking contract status:', error);
        return { hasTokens: false, isActive: false, tokensRemaining: 0 };
    }
}

// Function to check tokens in contract
async function checkContractTokens() {
    try {
        console.log('🔍 Checking tokens in contract...');
        
        if (!tokenContract || !launchpadContract) {
            showAlert('Please connect wallet first!', 'warning');
            return;
        }
        
        // Get token balance in launchpad
        const tokensInLaunchpad = await tokenContract.balanceOf(LAUNCHPAD_ADDRESS);
        const tokensFormatted = parseFloat(ethers.utils.formatEther(tokensInLaunchpad)).toFixed(2);
        
        // Get sale info
        const saleInfo = await launchpadContract.getSaleInfo();
        const rate = saleInfo._rate.toString();
        const totalRaised = ethers.utils.formatEther(saleInfo._totalRaised);
        const hardCap = ethers.utils.formatEther(saleInfo._hardCap);
        
        // Get time info
        const timeInfo = await launchpadContract.getTimeInfo();
        const isActive = timeInfo.isActive;
        
        // Show results
        const message = `
📊 CONTRACT STATUS:
━━━━━━━━━━━━━━━━━━━━
🪙 Tokens Available: ${tokensFormatted} YTK
💱 Exchange Rate: 1 ETH = ${rate} YTK
💰 Total Raised: ${totalRaised} ETH
🎯 Hard Cap: ${hardCap} ETH
⏰ Sale Active: ${isActive ? '✅ Yes' : '❌ No'}
━━━━━━━━━━━━━━━━━━━━

${tokensFormatted > 0 ? '✅ Tokens are available for purchase!' : '❌ NO TOKENS! Owner needs to transfer tokens to contract.'}
`;
        
        alert(message);
        
        if (parseFloat(tokensFormatted) <= 0) {
            showAlert(`No tokens in contract! Owner needs to transfer tokens from YourTokenSimple (${TOKEN_ADDRESS}) to LaunchpadAuto (${LAUNCHPAD_ADDRESS})`, 'danger');
        } else {
            showAlert(`✅ Contract has ${tokensFormatted} YTK tokens available for sale!`, 'success');
        }
        
    } catch (error) {
        console.error('Error checking contract tokens:', error);
        showAlert('Error checking contract: ' + error.message, 'danger');
    }
}

// Buy tokens
async function buyTokens() {
    try {
        const ethAmount = ethAmountInput.value;
        
        if (!ethAmount || parseFloat(ethAmount) <= 0) {
            showAlert('Please enter a valid ETH amount', 'warning');
            return;
        }
        
        // TEST MODE: Simulate buying tokens
        if (TEST_MODE) {
            console.log('TEST MODE: Simulating token purchase...');
            showLoading(buyTokensBtn, true);
            
            // Simulate transaction delay
            setTimeout(() => {
                showLoading(buyTokensBtn, false);
                showAlert(`Mock purchase: ${ethAmount} ETH for ${ethAmount * 1000} YTK tokens!`, 'success');
                
                // Clear inputs
                ethAmountInput.value = '';
                tokenAmountInput.value = '';
                
                // Update mock transaction list
                addTransactionToList(userAddress, ethAmount, ethAmount * 1000, 'Success (Mock)');
                
                console.log('✅ TEST MODE: Mock transaction completed');
            }, 2000);
            
            return;
        }        showLoading(buyTokensBtn, true);
        
        // Check contract status first
        const status = await checkContractStatus();
        
        if (!status.isActive) {
            throw new Error('Sale is not active. Please check the sale period.');
        }
        
        if (!status.hasTokens) {
            throw new Error('No tokens available in the launchpad contract. Please contact the owner.');
        }
        
        console.log('🔄 Starting buy tokens transaction...');
        console.log('  - ETH Amount:', ethAmount);
        console.log('  - ETH in Wei:', ethers.utils.parseEther(ethAmount).toString());
        console.log('  - Launchpad Address:', LAUNCHPAD_ADDRESS);
        console.log('  - User Address:', userAddress);
        
        // Check if user has enough ETH
        const userBalance = await provider.getBalance(userAddress);
        const requiredAmount = ethers.utils.parseEther(ethAmount);
        console.log('  - User Balance:', ethers.utils.formatEther(userBalance), 'ETH');
        console.log('  - Required Amount:', ethAmount, 'ETH');
        
        if (userBalance.lt(requiredAmount)) {
            throw new Error('Insufficient ETH balance');
        }
        
        // Check contract status before proceeding
        const contractStatus = await checkContractStatus();
        console.log('  - Contract Status:', contractStatus);
        
        if (!contractStatus.isActive) {
            throw new Error('Token sale is not active');
        }
        
        if (contractStatus.tokensRemaining.lte(0)) {
            throw new Error('No tokens remaining for sale');
        }
        
        // Send transaction
        console.log('📤 Sending transaction...');
        const tx = await launchpadContract.buyTokens({
            value: ethers.utils.parseEther(ethAmount)
        });
        
        console.log('✅ Transaction sent! Hash:', tx.hash);
        showAlert('Transaction sent! Waiting for confirmation...', 'info');
          // Wait for transaction confirmation
        console.log('⏳ Waiting for transaction confirmation...');
        const receipt = await tx.wait();
        console.log('✅ Transaction confirmed! Receipt:', receipt);
        
        showAlert('Tokens purchased successfully!', 'success');
        
        // Clear inputs
        ethAmountInput.value = '';
        tokenAmountInput.value = '';
        
        // Update UI
        await updateUI();
          } catch (error) {
        console.error('❌ Error buying tokens:', error);
        console.error('Error details:', {
            code: error.code,
            message: error.message,
            data: error.data,
            reason: error.reason
        });
        
        if (error.code === 4001) {
            showAlert('Transaction cancelled by user', 'warning');
        } else if (error.code === 'INSUFFICIENT_FUNDS') {
            showAlert('Insufficient funds. Please check your ETH balance.', 'danger');
        } else if (error.code === 'CALL_EXCEPTION') {
            showAlert('Contract call failed. Please check if sale is active and you have enough balance.', 'danger');
        } else if (error.message && error.message.includes('insufficient funds')) {
            showAlert('Insufficient ETH balance for this transaction', 'danger');
        } else if (error.message && error.message.includes('Hard cap reached')) {
            showAlert('Hard cap reached! Cannot purchase more tokens.', 'danger');
        } else if (error.message && error.message.includes('Launchpad has not started yet')) {
            showAlert('Sale has not started yet or has ended', 'warning');
        } else {
            showAlert('Transaction failed: ' + (error.message || 'Unknown error'), 'danger');
        }
    } finally {
        showLoading(buyTokensBtn, false);
    }
}

// Add transaction to list
function addTransactionToList(buyer, ethAmount, tokenAmount, status) {
    const row = document.createElement('tr');
    
    // Safely format the amounts
    let ethFormatted, tokenFormatted;
    
    if (typeof ethAmount === 'string' || typeof ethAmount === 'number') {
        // Already in readable format
        ethFormatted = parseFloat(ethAmount).toFixed(4);
    } else {
        // It's a BigNumber, need to format
        ethFormatted = parseFloat(ethers.utils.formatEther(ethAmount)).toFixed(4);
    }
    
    if (typeof tokenAmount === 'string' || typeof tokenAmount === 'number') {
        // Already in readable format
        tokenFormatted = parseFloat(tokenAmount).toFixed(2);
    } else {
        // It's a BigNumber, need to format
        tokenFormatted = parseFloat(ethers.utils.formatEther(tokenAmount)).toFixed(2);
    }
    
    row.innerHTML = `
        <td><code>${buyer.slice(0, 10)}...${buyer.slice(-8)}</code></td>
        <td>${buyer.slice(0, 6)}...${buyer.slice(-4)}</td>
        <td>${ethFormatted} ETH</td>
        <td>${tokenFormatted} YTK</td>
        <td><span class="badge bg-success">${status}</span></td>
    `;
    
    // If this is the first transaction, remove the "no transactions" row
    if (transactionList.children.length === 1 && transactionList.children[0].children.length === 1) {
        transactionList.innerHTML = '';
    }
    
    transactionList.prepend(row);
}

// Show alert
function showAlert(message, type) {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-custom alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at top of container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Show/hide loading state
function showLoading(button, isLoading) {
    const loadingSpinner = button.querySelector('.loading');
    
    if (isLoading) {
        button.disabled = true;
        if (loadingSpinner) {
            loadingSpinner.style.display = 'inline-block';
        }
    } else {
        button.disabled = false;
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }
    }
}

// Handle account changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length === 0) {
            // User disconnected wallet
            location.reload();
        } else {
            // User switched accounts
            location.reload();
        }    });
    
    window.ethereum.on('chainChanged', function (chainId) {
        // User switched networks
        location.reload();
    });
}

})(); // Close IIFE
