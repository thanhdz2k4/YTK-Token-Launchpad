import { LAUNCHPAD_ABI, TOKEN_ABI, NETWORK_CONFIG } from './launchpadAbi.js';

(function() {
'use strict';

// Contract addresses for Sepolia testnet (YOUR DEPLOYED CONTRACTS)
let LAUNCHPAD_ADDRESS = "0x96748C4718Bd81Ca418f5ec0A32dfc8a916e8Ae8"; // Your LaunchpadAuto contract
let TOKEN_ADDRESS = "0xF34DF1B06875AB34Da7F5E4FFC79a1Dc07F3289a"; // Your YourTokenSimple contract

// Global variables
let provider;
let signer;
let launchpadContract;
let tokenContract;
let userAddress;
let userEthBalance;

// DOM elements
let totalRaisedElement, 
startTime, 
endTime, 
currentRate,
hardCap, 
contributorCount, 
tokensRemaining, 
totalContributors,
totalContributed,
avgContribution;

document.addEventListener('DOMContentLoaded', function() {
   // Wait for ethers to be available
   const checkEthers = () => {
       if (typeof ethers === 'undefined') {
           console.log('⏳ Waiting for ethers.js to load...');
           setTimeout(checkEthers, 100);
           return;
       }
       
       console.log('✅ Ethers.js loaded successfully');
       
       totalRaisedElement = document.getElementById('totalRaised');
        startTime = document.getElementById('startTime');
        endTime = document.getElementById('endTime');
        currentRate = document.getElementById('currentRate');
        hardCap = document.getElementById('hardCap');
        contributorCount = document.getElementById('contributorCount');
        tokensRemaining = document.getElementById('tokensRemaining');
         totalContributors = document.getElementById('totalContributors');
        totalContributed = document.getElementById('totalContributed');
        avgContribution = document.getElementById('avgContribution');


       checkWalletConnection();
       setupEventListeners();
   };
   
   checkEthers();


});

function setupEventListeners() {

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

// Initialize contracts and signer
async function initializeContracts() {
    try {
        console.log('🔗 Initializing contracts...');
        
        // Check if ethers is available
        if (typeof ethers === 'undefined') {
            throw new Error('Ethers.js is not loaded');
        }
        
        console.log('Creating provider...');
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();
        console.log('✅ Connected to:', userAddress);

        console.log('Creating contracts...');
        launchpadContract = new ethers.Contract(LAUNCHPAD_ADDRESS, LAUNCHPAD_ABI, signer);
        tokenContract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
        console.log('✅ Contracts created');

        // Test contract connection
        console.log('Testing contract connection...');
        const owner = await launchpadContract.owner();
        console.log('✅ Contract owner:', owner);        // Fetch initial data
        userEthBalance = await provider.getBalance(userAddress);
        console.log('✅ Initial data loaded');
        
    } catch (error) {
        console.error('❌ Error initializing contracts:', error);
        showAlert(`Failed to initialize contracts: ${error.message}`, 'danger');
        throw error;
    }
}

// Update UI with current data
async function updateUI() {
    try {
        if (!launchpadContract || !tokenContract) return;
        // Update total raised
        const raised = await launchpadContract.totalRaised();
        if (totalRaisedElement) {
            totalRaisedElement.textContent = ethers.utils.formatEther(raised) + ' ETH';
        }
        startTime.textContent = new Date(await launchpadContract.startTime() * 1000).toLocaleString();
        endTime.textContent = new Date(await launchpadContract.endTime() * 1000).toLocaleString();
        currentRate.textContent = (await launchpadContract.rate()).toString();
        hardCap.textContent = ethers.utils.formatEther(await launchpadContract.hardCap()) + ' ETH';
        // Update contributor count and tokens remaining
        contributorCount.textContent = (await launchpadContract.getContributorCount()).toString();

        const tokenAddress = await launchpadContract.token(); // Lấy địa chỉ token contract từ launchpad
        const tokenInstance = new ethers.Contract(tokenAddress, TOKEN_ABI, provider); // Tạo instance
        const tokenBalance = await tokenInstance.balanceOf(LAUNCHPAD_ADDRESS); // Lấy số token còn lại
        tokensRemaining.textContent = ethers.utils.formatEther(tokenBalance) + ' TOKEN';
        
        const countContributors =(await launchpadContract.getContributorCount()).toString();
        const totalContributedVal = ethers.utils.formatEther(await launchpadContract.totalRaised()) + ' ETH';
        totalContributors.textContent = countContributors;
        totalContributed.textContent = totalContributedVal;
        avgContribution.textContent = (parseFloat(totalContributedVal) / parseInt(countContributors)).toFixed(4) + ' ETH';
        updateContributorsList();

    } catch (error) {
        console.error('Error updating UI:', error);
    }
}

async function updateContributorsList() {
    try {
        // 1. Lấy số lượng contributors
        const count = await launchpadContract.getContributorCount();
        contributorCount.textContent = count.toString();
        
        // Clear table
        contributorsTableBody.innerHTML = '';
        
        if (count.gt(0)) {
            // 2. Loop qua từng contributor
            for (let i = 0; i < count.toNumber(); i++) {
                // Lấy address từ array contributors
                const contributorAddress = await launchpadContract.contributors(i);
                
                // 3. ✅ Sử dụng mapping contributions để lấy amount
                const contributionAmount = await launchpadContract.contributions(contributorAddress);
                
                // 4. Thêm vào table
                addContributorRow(i + 1, contributorAddress, contributionAmount);
            }
        } else {
            contributorsTableBody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No contributors yet</td></tr>';
        }
        
    } catch (error) {
        console.error('Error loading contributors:', error);
        contributorCount.textContent = 'Error';
        contributorsTableBody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Error loading contributors</td></tr>';
    }
}

function addContributorRow(index, address, amount) {
    const row = document.createElement('tr');
    const ethAmount = ethers.utils.formatEther(amount);
    const shortAddress = `${address.substring(0, 6)}...${address.substring(38)}`;
    
    row.innerHTML = `
        <td>${index}</td>
        <td>
            <span class="contributor-address" title="${address}" onclick="copyToClipboard('${address}')">
                ${shortAddress}
                <i class="fas fa-copy ms-1" style="font-size: 12px; opacity: 0.7;"></i>
            </span>
        </td>
        <td class="fw-bold">${parseFloat(ethAmount).toFixed(4)} ETH</td>
    `;
    
    contributorsTableBody.appendChild(row);
}

// Show alert message
function showAlert(message, type = 'info') {
    console.log(`Alert [${type}]: ${message}`);
    // You can implement a proper alert system here
    if (type === 'warning' || type === 'danger') {
        alert(message);
    }
}

})(); // Close IIFE