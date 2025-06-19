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
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
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
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
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
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
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
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	}
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
const ytkBalanceSpan = document.getElementById('ytkBalance');
const ethBalanceSpan = document.getElementById('ethBalance');
const contributionSpan = document.getElementById('contribution');
const contractAddressSpan = document.getElementById('contractAddress');
const userAddressSpan = document.getElementById('userAddress');
const transactionList = document.getElementById('transactionList');

// Send modal variables (will be initialized in DOMContentLoaded)
let showSendFormBtn, sendModal, sendTokensBtn, sendToAddressInput, sendAmountInput, sendErrorTextSendToken, sendSuccessText;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM Content Loaded - Starting initialization...');
    
    // Initialize send modal elements
    showSendFormBtn = document.getElementById('showSendFormBtn');
    sendModal = document.getElementById('sendModal');
    sendTokensBtn = document.getElementById('sendTokensBtn');
    sendToAddressInput = document.getElementById('sendToAddressInput');
    sendAmountInput = document.getElementById('sendAmountInput');
    sendErrorTextSendToken = document.getElementById('sendErrorTextSendToken');
    sendSuccessText = document.getElementById('sendSuccessText');

    console.log('🔍 Send form elements check:');
    console.log('  - showSendFormBtn:', showSendFormBtn);
    console.log('  - sendModal:', sendModal);
    
    checkWalletConnection();
    setupEventListeners();
    buyTokensBtn.disabled = true; // Disable until wallet is connected

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
      // Setup send form button
    if (showSendFormBtn) {
        showSendFormBtn.addEventListener('click', showSendFormTokenForm);
        console.log('✅ Send form button event listener added');
    } else {
        console.error('❌ showSendFormBtn element not found!');
    }
    sendTokensBtn.addEventListener('click', sendTokens);

    sendToAddressInput.addEventListener('input', handleInputSendTokenChange);
    sendAmountInput.addEventListener('input', handleInputSendTokenChange);

    // Setup send modal close events
    setupSendModalEventListeners();
}
// 0xAfAF9562147d429FDBeF8386B4a6bFb5c622accA
// handle input changes in send form
    async function handleInputSendTokenChange() {
    const toAddress = sendToAddressInput.value;

    const amount = parseFloat(sendAmountInput.value) || 0;
    let userTokenBalance = 0;
    try 
    {
        userTokenBalance = await tokenContract.balanceOf(userAddress);
    }
    catch (error) {
        console.error('Error fetching user token balance:', error);
    }

    if(amount > 0 && ethers.utils.isAddress(toAddress) && toAddress != userAddress) {
        sendTokensBtn.disabled = false;
    } else {
        sendTokensBtn.disabled = true;
    }

    if(amount > parseFloat(ethers.utils.formatEther(userTokenBalance))) {
        sendErrorTextSendToken.innerHTML = 'Insufficient token balance';
        sendTokensBtn.disabled = true;
    }
    else {
        sendErrorTextSendToken.innerHTML = '';
    }
}

// send tokens 
async function sendTokens() {

    const toAddress = sendToAddressInput.value;
    const amount = parseFloat(sendAmountInput.value);
    
    try {
        showLoading(sendTokensBtn, true);
        const tx = await tokenContract.transfer(toAddress, ethers.utils.parseEther(amount.toString()));
        sendSuccessText.innerHTML = `Loading ...`;
        showAlert(`Sending ${amount} tokens to ${toAddress}`, 'info');
        await tx.wait();
        sendSuccessText.innerHTML = `Successfully sent ${amount} tokens to ${toAddress}`;
        showAlert(`Successfully sent ${amount} tokens to ${toAddress}`, 'success');
        // Reset form
        sendToAddressInput.value = '';
        sendAmountInput.value = '';
    } catch (error) {
        sendErrorTextSendToken.innerHTML = `Failed to send tokens: ${error.message}`;
        showAlert(`Failed to send tokens: ${error.message}`, 'danger'); 
    } finally {
        showLoading(sendTokensBtn, false);
    }

}

// show send form
function showSendFormTokenForm() {
    console.log('🚀 showSendFormTokenForm() called');
    console.log('🔍 Checking sendModal element:', sendModal);
    
    if (!sendModal) {
        console.error('❌ sendModal element not found! Re-attempting to get element...');
        sendModal = document.getElementById('sendModal');
        console.log('🔍 Re-check sendModal:', sendModal);
    }
    
    if (sendModal) {
        console.log('✅ sendModal found, showing modal...');
        sendModal.style.display = 'flex';
        console.log('✅ Modal display set to flex');
        
        // Add animation class after a brief delay
        setTimeout(() => {
            sendModal.classList.add('show');
            console.log('✅ Added show class for animation');
        }, 10);
        
    } else {
        console.error('❌ sendModal element still not found! Check if HTML contains element with id="sendModal"');
        
        // Debug: List all elements with send-related IDs
        const allElements = document.querySelectorAll('[id*="send"], [id*="Send"], [id*="modal"], [id*="Modal"]');
        console.log('🔍 Found elements with send/modal in ID:', allElements);
    }
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
        
        // Start countdown timer
        startCountdownTimer();
        
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
        updateSaleStatus();
        
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
        
        
        // Enable ETH amount input
        ethAmountInput.disabled = false;
        ethAmountInput.placeholder = 'Enter ETH amount (demo only)';
          console.log('✅ Real wallet data loaded:');
        console.log('  - Address:', userAddress);
        console.log('  - ETH Balance:', ethBalanceFormatted);
        console.log('  - Network:', network.name);
        
        // Start countdown timer for demo mode too
        startCountdownTimer();
        
    } catch (error) {
        console.error('Error updating UI with wallet data:', error);
        showAlert('Error loading wallet data: ' + error.message, 'danger');
    }
}

// Update sale status and countdown
function updateSaleStatus() {
    try {
        console.log("🕐 Updating sale status and countdown...");
        
        // Get current timestamp
        const now = Math.floor(Date.now() / 1000);
        
        if (launchpadContract) {
            // Try to get real times from contract (but don't wait for it every second)
            if (!window.cachedTimeInfo || (now - window.lastTimeUpdate) > 60) {
                // Only fetch from contract every 60 seconds to avoid delays
                console.log("📡 Fetching fresh time info from contract...");
                launchpadContract.getTimeInfo().then(timeInfo => {
                    window.cachedTimeInfo = {
                        currentTime: parseInt(timeInfo.currentTime),
                        saleStart: parseInt(timeInfo.saleStart),
                        saleEnd: parseInt(timeInfo.saleEnd),
                        isActive: timeInfo.isActive
                    };
                    window.lastTimeUpdate = now;
                    
                    console.log("📊 Contract time info cached:");
                    console.log("  Current:", new Date(window.cachedTimeInfo.currentTime * 1000).toLocaleString());
                    console.log("  Start:", new Date(window.cachedTimeInfo.saleStart * 1000).toLocaleString());
                    console.log("  End:", new Date(window.cachedTimeInfo.saleEnd * 1000).toLocaleString());
                    console.log("  Is Active:", window.cachedTimeInfo.isActive);
                }).catch(error => {
                    console.log("⚠️ Contract call failed, using demo times:", error.message);
                    setupDemoTimeInfo(now);
                });
            }
            
            // Use cached info for real-time updates
            if (window.cachedTimeInfo) {
                // Calculate time offset from when we last got contract time
                const timeOffset = now - window.lastTimeUpdate;
                const currentTime = window.cachedTimeInfo.currentTime + timeOffset;
                
                updateCountdownAndStatus(currentTime, window.cachedTimeInfo.saleStart, window.cachedTimeInfo.saleEnd, window.cachedTimeInfo.isActive);
            } else {
                // Fallback while waiting for first contract call
                setupDemoTimeInfo(now);
                updateCountdownAndStatus(now, window.demoTimeInfo.saleStart, window.demoTimeInfo.saleEnd, window.demoTimeInfo.isActive);
            }
        } else {
            console.log("📊 No contract, using demo times");
            setupDemoTimeInfo(now);
            updateCountdownAndStatus(now, window.demoTimeInfo.saleStart, window.demoTimeInfo.saleEnd, window.demoTimeInfo.isActive);
        }
    } catch (error) {
        console.error("❌ Error in updateSaleStatus:", error);
        // Fallback display
        const saleStatusElement = document.getElementById('saleStatus');
        const countdownElement = document.getElementById('countdown');
        
        if (saleStatusElement) {
            saleStatusElement.textContent = "Demo Mode";
            saleStatusElement.className = "badge bg-warning fs-6 p-2 mb-2";
        }
        if (countdownElement) {
            countdownElement.textContent = "Demo Mode";
        }
    }
}

function setupDemoTimeInfo(now) {
    if (!window.demoTimeInfo) {
        window.demoTimeInfo = {
            saleStart: now - 3600, // Started 1 hour ago
            saleEnd: now + (7 * 24 * 3600), // Ends in 7 days
            isActive: true
        };
        console.log("📊 Demo time info setup");
    }
}
function updateCountdownAndStatus(currentTime, startTime, endTime, isActive) {
    // Only log every 10 seconds to reduce spam
    const logNow = Math.floor(Date.now() / 1000) % 10 === 0;
    
    if (logNow) {
        console.log("🔄 updateCountdownAndStatus called with:");
        console.log("  currentTime:", currentTime, "->", new Date(currentTime * 1000).toLocaleString());
        console.log("  startTime:", startTime, "->", new Date(startTime * 1000).toLocaleString());
        console.log("  endTime:", endTime, "->", new Date(endTime * 1000).toLocaleString());
        console.log("  isActive:", isActive);
    }
    
    const saleStatusElement = document.getElementById('saleStatus');
    const countdownElement = document.getElementById('countdown');
    
    if (!saleStatusElement || !countdownElement) {
        console.error("❌ Status elements not found!");
        return;
    }
    
    // Calculate time differences
    const timeToStart = startTime - currentTime;
    const timeToEnd = endTime - currentTime;
    
    if (logNow) {
        console.log("⏰ Time calculations:");
        console.log("  timeToStart:", timeToStart, "seconds");
        console.log("  timeToEnd:", timeToEnd, "seconds");
    }
    
    if (timeToStart > 0) {
        // Sale hasn't started yet
        if (logNow) console.log("📅 Sale hasn't started yet");
        saleStatusElement.textContent = "Sale Not Started";
        saleStatusElement.className = "badge bg-warning fs-6 p-2 mb-2";
        
        // Show countdown to start
        const timeString = formatTimeRemaining(timeToStart);
        countdownElement.textContent = `Starts in: ${timeString}`;
        countdownElement.className = "countdown";
        
    } else if (timeToEnd > 0 && isActive) {
        // Sale is active
        if (logNow) console.log("🟢 Sale is active");
        saleStatusElement.textContent = "Sale Active";
        saleStatusElement.className = "badge bg-success fs-6 p-2 mb-2";
        
        // Show countdown to end
        const timeString = formatTimeRemaining(timeToEnd);
        countdownElement.textContent = timeString;
        countdownElement.className = "countdown";
        
    } else {
        // Sale has ended
        if (logNow) console.log("🔴 Sale has ended");
        saleStatusElement.textContent = "Sale Ended";
        saleStatusElement.className = "badge bg-danger fs-6 p-2 mb-2";
        
        countdownElement.textContent = "EXPIRED";
        countdownElement.className = "countdown expired";
    }
}

function formatTimeRemaining(seconds) {
    if (seconds <= 0) return "00:00:00";
    
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    let result;
    if (days > 0) {
        result = `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        result = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    return result;
}

// Update countdown every second
let countdownInterval;

function startCountdownTimer() {
    console.log("🚀 startCountdownTimer() called");
    
    // Clear existing interval
    if (countdownInterval) {
        console.log("⏹️ Clearing existing countdown interval");
        clearInterval(countdownInterval);
    }
    
    // Check if elements exist
    const saleStatusElement = document.getElementById('saleStatus');
    const countdownElement = document.getElementById('countdown');
    console.log("📱 Elements check in startCountdownTimer:");
    console.log("  saleStatus exists:", !!saleStatusElement);
    console.log("  countdown exists:", !!countdownElement);
    
    if (!saleStatusElement || !countdownElement) {
        console.error("❌ Required elements not found, cannot start timer");
        return;
    }
    
    // Reset cache
    window.cachedTimeInfo = null;
    window.lastTimeUpdate = 0;
    
    // Update immediately
    console.log("⚡ Calling updateSaleStatus immediately");
    updateSaleStatus();
    
    // Update every second
    countdownInterval = setInterval(() => {
        // Only log every 10 seconds to reduce spam
        if (Math.floor(Date.now() / 1000) % 10 === 0) {
            console.log("⏰ Timer tick (10s interval log)");
        }
        updateSaleStatus();
    }, 1000);
    
    console.log("✅ Countdown timer started successfully");
}

function stopCountdownTimer() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
        countdownInterval = null;
        console.log("⏰ Countdown timer stopped");
    }
}



// Calculate token amount based on ETH input
function calculateTokenAmount() {
    const ethAmount = parseFloat(ethAmountInput.value) || 0;
    const tokenAmount = ethAmount * 1000; // Rate: 1 ETH = 1000 tokens
    tokenAmountInput.value = tokenAmount.toFixed(2);

    if(ethAmount > 0) {
        buyTokensBtn.disabled = false;
    } else {
        buyTokensBtn.disabled = true;
    }
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

// Test countdown immediately when page loads
function testCountdown() {
    console.log("🧪 Testing countdown elements...");
    
    const saleStatusElement = document.getElementById('saleStatus');
    const countdownElement = document.getElementById('countdown');
    
    console.log("Elements found:");
    console.log("  saleStatus:", saleStatusElement);
    console.log("  countdown:", countdownElement);
    
    if (saleStatusElement) {
        console.log("✅ saleStatus element exists");
    } else {
        console.error("❌ saleStatus element NOT found");
    }
    
    if (countdownElement) {
        console.log("✅ countdown element exists");
    } else {
        console.error("❌ countdown element NOT found");
    }
    
    // DON'T override the countdown text, just test that elements exist
    console.log("🔄 Elements tested, ready for real countdown");
}

// Call test immediately
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(testCountdown, 500); // Test after 500ms
});

// Additional send modal functions
function hideSendModal() {
    console.log('🚀 hideSendModal() called');
    if (sendModal) {
        sendModal.classList.remove('show');
        setTimeout(() => {
            sendModal.style.display = 'none';
            console.log('✅ Modal hidden');
        }, 300); // Wait for animation
    }
}

function setupSendModalEventListeners() {
    console.log('🔧 Setting up send modal event listeners...');
    
    // Close button
    const closeSendModalBtn = document.getElementById('closeSendModal');
    if (closeSendModalBtn) {
        closeSendModalBtn.addEventListener('click', hideSendModal);
        console.log('✅ Close button event listener added');
    } else {
        console.log('❌ Close button not found');
    }
    
    // Click outside to close
    if (sendModal) {
        sendModal.addEventListener('click', function(e) {
            if (e.target === sendModal) {
                hideSendModal();
            }
        });
    }
    
    // Escape key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sendModal && sendModal.style.display !== 'none') {
            hideSendModal();
        }
    });
}

// Test function to debug modal
window.testShowModal = function() {
    console.log('🧪 TEST: Manual modal show');
    const modal = document.getElementById('sendModal');
    console.log('  - Modal element:', modal);
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('show');
        console.log('  - Modal should be visible now');
    }
};

window.testHideModal = function() {
    console.log('🧪 TEST: Manual modal hide');
    const modal = document.getElementById('sendModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        console.log('  - Modal should be hidden now');
    }
};

})(); // Close IIFE
