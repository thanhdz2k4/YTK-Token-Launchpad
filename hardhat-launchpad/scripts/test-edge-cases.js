const hre = require("hardhat");

async function testEdgeCases() {
    console.log("🧪 Testing Edge Cases...");
    
    // Deploy contracts
    const initialSupply = hre.ethers.parseEther("1000000");
    const Token = await hre.ethers.getContractFactory("YourToken");
    const token = await Token.deploy(initialSupply);
    await token.waitForDeployment();
    
    const rate = 1000;
    const startTime = Math.floor(Date.now() / 1000) + 5;
    const endTime = startTime + 60; // 1 minute sale
    const hardCap = hre.ethers.parseEther("2"); // Very low hard cap
    
    const Launchpad = await hre.ethers.getContractFactory("Launchpad");
    const launchpad = await Launchpad.deploy(
        await token.getAddress(),
        rate,
        startTime,
        endTime,
        hardCap
    );
    await launchpad.waitForDeployment();
    
    await token.transfer(await launchpad.getAddress(), hre.ethers.parseEther("10000"));
    
    const [owner, buyer1, buyer2] = await hre.ethers.getSigners();
    
    // Wait for sale to start
    await new Promise(resolve => setTimeout(resolve, 6000));
    
    console.log("\n1. 🧪 Test Hard Cap Limit...");
    try {
        // Fill hard cap with buyer1
        await launchpad.connect(buyer1).buyTokens({ value: hardCap });
        console.log("✅ Buyer1 filled hard cap successfully");
        
        // Try to buy more (should fail)
        await launchpad.connect(buyer2).buyTokens({ value: hre.ethers.parseEther("0.1") });
        console.log("❌ ERROR: Should have failed!");
        
    } catch (error) {
        if (error.message.includes("Hard cap reached")) {
            console.log("✅ Hard cap protection working correctly");
        } else {
            console.log("❌ Unexpected error:", error.message);
        }
    }
    
    console.log("\n2. 🧪 Test Zero ETH Purchase...");
    try {
        await launchpad.connect(buyer2).buyTokens({ value: 0 });
        console.log("❌ ERROR: Should have failed!");
    } catch (error) {
        if (error.message.includes("Must send ETH")) {
            console.log("✅ Zero ETH protection working correctly");
        } else {
            console.log("❌ Unexpected error:", error.message);
        }
    }
    
    console.log("\n3. 🧪 Test Non-Owner Withdrawal...");
    try {
        await launchpad.connect(buyer1).withdraw();
        console.log("❌ ERROR: Should have failed!");
    } catch (error) {
        if (error.message.includes("Only owner")) {
            console.log("✅ Owner-only protection working correctly");
        } else {
            console.log("❌ Unexpected error:", error.message);
        }
    }
    
    console.log("\n🎉 Edge case testing completed!");
}

testEdgeCases().catch(console.error);
