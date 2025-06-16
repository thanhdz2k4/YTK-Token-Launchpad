const hre = require("hardhat");

async function main() {
    console.log(`🚀 Deploying to ${hre.network.name} network...`);
    
    // Get deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    
    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");
    
    if (balance < hre.ethers.parseEther("0.01")) {
        console.log("⚠️  Warning: Low balance. You might need more ETH for deployment.");
    }
    
    // 1. Deploy Token
    console.log("\n📄 Deploying YourToken...");
    const initialSupply = hre.ethers.parseEther("1000000"); // 1 million tokens
    const Token = await hre.ethers.getContractFactory("YourToken");
    const token = await Token.deploy(initialSupply);
    await token.waitForDeployment();
    
    const tokenAddress = await token.getAddress();
    console.log("✅ YourToken deployed to:", tokenAddress);
    
    // 2. Deploy Launchpad
    console.log("\n🚀 Deploying Launchpad...");
    const rate = 1000; // 1 ETH = 1000 tokens
    const startTime = Math.floor(Date.now() / 1000) + 300; // Start in 5 minutes
    const endTime = startTime + 86400; // End in 24 hours
    const hardCap = hre.ethers.parseEther("5"); // 5 ETH hard cap for testnet
    
    const Launchpad = await hre.ethers.getContractFactory("Launchpad");
    const launchpad = await Launchpad.deploy(
        tokenAddress,
        rate,
        startTime,
        endTime,
        hardCap
    );
    await launchpad.waitForDeployment();
    
    const launchpadAddress = await launchpad.getAddress();
    console.log("✅ Launchpad deployed to:", launchpadAddress);
    
    // 3. Transfer tokens to Launchpad
    console.log("\n💰 Transferring tokens to Launchpad...");
    const tokensForSale = hre.ethers.parseEther("500000"); // 500k tokens for sale
    const transferTx = await token.transfer(launchpadAddress, tokensForSale);
    await transferTx.wait();
    console.log("✅ Transferred 500,000 YTK to Launchpad");
    
    // 4. Verify deployment
    console.log("\n🔍 Verifying deployment...");
    const launchpadBalance = await token.balanceOf(launchpadAddress);
    console.log("Launchpad token balance:", hre.ethers.formatEther(launchpadBalance), "YTK");
    
    // 5. Display deployment summary
    console.log("\n" + "=".repeat(60));
    console.log("🎉 DEPLOYMENT SUCCESSFUL!");
    console.log("=".repeat(60));
    console.log(`Network: ${hre.network.name}`);
    console.log(`YourToken: ${tokenAddress}`);
    console.log(`Launchpad: ${launchpadAddress}`);
    console.log(`Start Time: ${new Date(startTime * 1000)}`);
    console.log(`End Time: ${new Date(endTime * 1000)}`);
    console.log(`Hard Cap: ${hre.ethers.formatEther(hardCap)} ETH`);
    console.log(`Rate: ${rate} YTK per ETH`);
    console.log("=".repeat(60));
    
    // 6. Update frontend config
    console.log("\n📝 Update your frontend config.js with these addresses:");
    console.log(`${hre.network.name}: {`);
    console.log(`    LAUNCHPAD_ADDRESS: "${launchpadAddress}",`);
    console.log(`    TOKEN_ADDRESS: "${tokenAddress}",`);
    console.log(`},`);
    
    // 7. Verification instructions
    if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
        console.log("\n🔍 To verify contracts on explorer, run:");
        console.log(`npx hardhat verify --network ${hre.network.name} ${tokenAddress} ${initialSupply}`);
        console.log(`npx hardhat verify --network ${hre.network.name} ${launchpadAddress} ${tokenAddress} ${rate} ${startTime} ${endTime} ${hardCap}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
