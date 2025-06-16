const hre = require("hardhat");

async function main() {
    console.log("🚀 Testing Launchpad Deployment and Interaction...");
    
    // Deploy fresh contracts
    console.log("\n📦 Deploying contracts...");
    
    // 1. Deploy Token
    const initialSupply = hre.ethers.parseEther("1000000");
    const Token = await hre.ethers.getContractFactory("YourToken");
    const token = await Token.deploy(initialSupply);
    await token.waitForDeployment();
    
    const tokenAddress = await token.getAddress();
    console.log("✅ Token deployed to:", tokenAddress);
    
    // 2. Deploy Launchpad
    const rate = 1000;
    const startTime = Math.floor(Date.now() / 1000) + 10; // Start in 10 seconds
    const endTime = startTime + 3600; // End in 1 hour
    const hardCap = hre.ethers.parseEther("10");
    
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
    
    // 3. Transfer tokens to launchpad
    const tokenForSale = hre.ethers.parseEther("500000");
    await token.transfer(launchpadAddress, tokenForSale);
    console.log("✅ Transferred 500k tokens to Launchpad");
    
    // Get accounts
    const [owner, buyer1, buyer2] = await hre.ethers.getSigners();
    
    // Check initial states
    console.log("\n📋 Contract Info:");
    console.log("Owner:", owner.address);
    console.log("Buyer1:", buyer1.address);
    console.log("Buyer2:", buyer2.address);
    
    console.log("\n🔍 Launchpad Details:");
    console.log("Rate:", await launchpad.rate(), "tokens per ETH");
    console.log("Start Time:", new Date(Number(await launchpad.startTime()) * 1000));
    console.log("End Time:", new Date(Number(await launchpad.endTime()) * 1000));
    console.log("Hard Cap:", hre.ethers.formatEther(await launchpad.hardCap()), "ETH");
    console.log("Total Raised:", hre.ethers.formatEther(await launchpad.totalRaised()), "ETH");
    
    // Check token balances
    console.log("\n💰 Token Balances:");
    console.log("Owner balance:", hre.ethers.formatEther(await token.balanceOf(owner.address)), "YTK");
    console.log("Launchpad balance:", hre.ethers.formatEther(await token.balanceOf(launchpadAddress)), "YTK");
    
    // Wait for sale to start
    const currentTime = Math.floor(Date.now() / 1000);
    if (currentTime < startTime) {
        const waitTime = startTime - currentTime + 1;
        console.log(`\n⏳ Waiting ${waitTime} seconds for sale to start...`);
        await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
    }
    
    console.log("\n🛒 Starting token purchases...");
    
    try {
        // Buyer1 purchases
        const ethAmount1 = hre.ethers.parseEther("1");
        console.log(`Buyer1 purchasing with ${hre.ethers.formatEther(ethAmount1)} ETH...`);
        
        const tx1 = await launchpad.connect(buyer1).buyTokens({ value: ethAmount1 });
        const receipt1 = await tx1.wait();
        
        console.log("✅ Buyer1 purchase successful!");
        console.log("Transaction hash:", tx1.hash);
        console.log("Gas used:", receipt1.gasUsed.toString());
        
        // Check balances after purchase
        const buyer1TokenBalance = await token.balanceOf(buyer1.address);
        const buyer1Contribution = await launchpad.contributions(buyer1.address);
        
        console.log("Buyer1 token balance:", hre.ethers.formatEther(buyer1TokenBalance), "YTK");
        console.log("Buyer1 ETH contribution:", hre.ethers.formatEther(buyer1Contribution), "ETH");
        
    } catch (error) {
        console.log("❌ Buyer1 purchase failed:", error.message);
    }
    
    try {
        // Buyer2 purchases
        const ethAmount2 = hre.ethers.parseEther("2");
        console.log(`\nBuyer2 purchasing with ${hre.ethers.formatEther(ethAmount2)} ETH...`);
        
        const tx2 = await launchpad.connect(buyer2).buyTokens({ value: ethAmount2 });
        await tx2.wait();
        
        console.log("✅ Buyer2 purchase successful!");
        
        // Check final state
        const buyer2TokenBalance = await token.balanceOf(buyer2.address);
        const buyer2Contribution = await launchpad.contributions(buyer2.address);
        const totalRaised = await launchpad.totalRaised();
        
        console.log("Buyer2 token balance:", hre.ethers.formatEther(buyer2TokenBalance), "YTK");
        console.log("Buyer2 ETH contribution:", hre.ethers.formatEther(buyer2Contribution), "ETH");
        console.log("Total ETH raised:", hre.ethers.formatEther(totalRaised), "ETH");
        
    } catch (error) {
        console.log("❌ Buyer2 purchase failed:", error.message);
    }
    
    // Test withdrawal
    console.log("\n💸 Testing ETH withdrawal...");
    try {
        const contractBalance = await hre.ethers.provider.getBalance(launchpadAddress);
        console.log("Contract ETH balance:", hre.ethers.formatEther(contractBalance), "ETH");
        
        if (contractBalance > 0) {
            const withdrawTx = await launchpad.withdraw();
            await withdrawTx.wait();
            console.log("✅ ETH withdrawal successful!");
            
            const newContractBalance = await hre.ethers.provider.getBalance(launchpadAddress);
            console.log("Contract balance after withdrawal:", hre.ethers.formatEther(newContractBalance), "ETH");
        } else {
            console.log("⚠️ No ETH to withdraw");
        }
        
    } catch (error) {
        console.log("❌ Withdrawal failed:", error.message);
    }
    
    console.log("\n🎉 Test completed!");
}

main().catch((error) => {
    console.error("❌ Script failed:", error);
    process.exitCode = 1;
});
