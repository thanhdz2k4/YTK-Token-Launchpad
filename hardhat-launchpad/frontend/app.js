// Contract addresses - Update these with your deployed contracts
const LAUNCHPAD_ADDRESS = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
const TOKEN_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

// Contract ABIs
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

// Global variables
let provider;
let signer;
let launchpadContract;
let tokenContract;
let userAddress;

// DOM elements
const connectWalletBtn = document.getElementById('connectWallet');
const walletStatus = document.getElementById('walletStatus');
const walletStatusText = document.getElementById('walletStatusText');
const ethAmountInput = document.getElementById('ethAmount');
const tokenAmountInput = document.getElementById('tokenAmount');
const buyTokensBtn = document.getElementById('buyTokensBtn');
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
    console.log('connectWallet function called');
    console.log('window.ethereum:', typeof window.ethereum);
    console.log('connectWalletBtn:', connectWalletBtn);
    
    if (typeof window.ethereum !== 'undefined') {
        try {
            console.log('MetaMask detected, requesting accounts...');
            showLoading(connectWalletBtn, true);
            
            // Request account access
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            console.log('Accounts received:', accounts);
            
            await initializeContracts();
            await updateUI();
            
            showAlert('Wallet connected successfully!', 'success');
        } catch (error) {
            console.error('Error connecting wallet:', error);
            showAlert('Failed to connect wallet', 'danger');
        } finally {
            showLoading(connectWalletBtn, false);
        }
    } else {
        console.log('MetaMask not detected');
        showAlert('Please install MetaMask', 'warning');
    }
}

// Initialize contracts
async function initializeContracts() {
    try {
        // Initialize provider and signer
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        
        // Initialize contracts
        launchpadContract = new ethers.Contract(LAUNCHPAD_ADDRESS, LAUNCHPAD_ABI, signer);
        tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
        
        // Setup event listeners for contract events
        setupContractEventListeners();
        
        console.log('Contracts initialized successfully');
    } catch (error) {
        console.error('Error initializing contracts:', error);
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
        
        // Get contract data
        const [
            totalRaised,
            hardCap,
            startTime,
            endTime,
            userContribution,
            userTokenBalance,
            userEthBalance
        ] = await Promise.all([
            launchpadContract.totalRaised(),
            launchpadContract.hardCap(),
            launchpadContract.startTime(),
            launchpadContract.endTime(),
            launchpadContract.contributions(userAddress),
            tokenContract.balanceOf(userAddress),
            provider.getBalance(userAddress)
        ]);
        
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

// Buy tokens
async function buyTokens() {
    try {
        const ethAmount = ethAmountInput.value;
        
        if (!ethAmount || parseFloat(ethAmount) <= 0) {
            showAlert('Please enter a valid ETH amount', 'warning');
            return;
        }
        
        showLoading(buyTokensBtn, true);
        
        // Send transaction
        const tx = await launchpadContract.buyTokens({
            value: ethers.utils.parseEther(ethAmount)
        });
        
        showAlert('Transaction sent! Waiting for confirmation...', 'info');
        
        // Wait for transaction confirmation
        const receipt = await tx.wait();
        
        showAlert('Tokens purchased successfully!', 'success');
        
        // Clear inputs
        ethAmountInput.value = '';
        tokenAmountInput.value = '';
        
        // Update UI
        await updateUI();
        
    } catch (error) {
        console.error('Error buying tokens:', error);
        
        if (error.code === 4001) {
            showAlert('Transaction cancelled by user', 'warning');
        } else if (error.message.includes('Hard cap reached')) {
            showAlert('Hard cap reached! Cannot purchase more tokens.', 'danger');
        } else if (error.message.includes('Launchpad has not started yet')) {
            showAlert('Sale has not started yet or has ended', 'warning');
        } else {
            showAlert('Transaction failed. Please try again.', 'danger');
        }
    } finally {
        showLoading(buyTokensBtn, false);
    }
}

// Add transaction to list
function addTransactionToList(buyer, ethAmount, tokenAmount, status) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><code>${buyer.slice(0, 10)}...${buyer.slice(-8)}</code></td>
        <td>${buyer.slice(0, 6)}...${buyer.slice(-4)}</td>
        <td>${parseFloat(ethers.utils.formatEther(ethAmount)).toFixed(4)} ETH</td>
        <td>${parseFloat(ethers.utils.formatEther(tokenAmount)).toFixed(2)} YTK</td>
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
        }
    });
    
    window.ethereum.on('chainChanged', function (chainId) {
        // User switched networks
        location.reload();
    });
}
