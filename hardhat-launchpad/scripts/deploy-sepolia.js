const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Starting deployment to Sepolia testnet...");
    
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);    // Check balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");
    
    if (balance < ethers.utils.parseEther("0.01")) {
        console.log("⚠️ WARNING: Low balance! Get Sepolia ETH from faucet:");
        console.log("🔗 https://sepoliafaucet.com/");
        console.log("🔗 https://faucet.sepolia.dev/");
    }
      // Deploy YourToken first
    console.log("\n📦 Deploying YourToken...");
    const YourToken = await ethers.getContractFactory("YourToken");
    const yourToken = await YourToken.deploy();
    await yourToken.waitForDeployment();
    console.log("✅ YourToken deployed to:", await yourToken.getAddress());
    
    // Wait for confirmations
    console.log("⏳ Waiting for confirmations...");
    await yourToken.deploymentTransaction().wait(2);
    
    // Deploy Launchpad
    console.log("\n📦 Deploying Launchpad...");
    const Launchpad = await ethers.getContractFactory("Launchpad");
    
    // Launchpad constructor parameters
    const tokenAddress = await yourToken.getAddress();
    const rate = 1000; // 1 ETH = 1000 tokens
    const startTime = Math.floor(Date.now() / 1000) + 60; // Start 1 minute from now
    const endTime = startTime + (7 * 24 * 60 * 60); // End 7 days later
    const hardCap = ethers.utils.parseEther("10"); // 10 ETH hard cap
      const launchpad = await Launchpad.deploy(
        tokenAddress,
        rate,
        startTime,
        endTime,
        hardCap
    );
    await launchpad.waitForDeployment();
    console.log("✅ Launchpad deployed to:", await launchpad.getAddress());
    
    // Wait for confirmations
    console.log("⏳ Waiting for confirmations...");
    await launchpad.deploymentTransaction().wait(2);
      // Transfer tokens to launchpad
    console.log("\n💸 Transferring tokens to launchpad...");
    const tokenAmount = ethers.utils.parseEther("1000000"); // 1 million tokens
    const transferTx = await yourToken.transfer(await launchpad.getAddress(), tokenAmount);
    await transferTx.wait(2);
    console.log("✅ Transferred", ethers.utils.formatEther(tokenAmount), "tokens to launchpad");
      // Verification info
    const tokenAddr = await yourToken.getAddress();
    const launchpadAddr = await launchpad.getAddress();
    
    console.log("\n📋 DEPLOYMENT SUMMARY:");
    console.log("=".repeat(50));
    console.log("🪙 Token Address:", tokenAddr);
    console.log("🚀 Launchpad Address:", launchpadAddr);
    console.log("📊 Rate:", rate, "tokens per ETH");
    console.log("⏰ Start Time:", new Date(startTime * 1000).toLocaleString());
    console.log("⏰ End Time:", new Date(endTime * 1000).toLocaleString());
    console.log("💰 Hard Cap:", ethers.utils.formatEther(hardCap), "ETH");
    console.log("=".repeat(50));
    
    console.log("\n🔍 Etherscan Links:");
    console.log("Token:", `https://sepolia.etherscan.io/address/${tokenAddr}`);
    console.log("Launchpad:", `https://sepolia.etherscan.io/address/${launchpadAddr}`);
    
    console.log("\n📝 Next steps:");
    console.log("1. Update frontend/app.js with the contract addresses");
    console.log("2. Update .env file with the addresses");
    console.log("3. Verify contracts on Etherscan (optional)");
      // Save addresses to file
    const fs = require('fs');
    const addresses = {
        network: "sepolia",
        token: tokenAddr,
        launchpad: launchpadAddr,
        deployer: deployer.address,
        timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync('deployed-addresses.json', JSON.stringify(addresses, null, 2));
    console.log("\n💾 Addresses saved to deployed-addresses.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
