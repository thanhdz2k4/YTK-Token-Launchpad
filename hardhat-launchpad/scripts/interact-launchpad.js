const hre = require("hardhat");

async function main() {    // Địa chỉ contracts (update từ kết quả deploy)
    const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const launchpadAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    
    // Lấy accounts
    const [owner, buyer1, buyer2] = await hre.ethers.getSigners();
    console.log("Owner:", owner.address);
    console.log("Buyer1:", buyer1.address);
    console.log("Buyer2:", buyer2.address);
    
    // Get contract instances
    const Token = await hre.ethers.getContractFactory("YourToken");
    const token = Token.attach(tokenAddress);
    
    const Launchpad = await hre.ethers.getContractFactory("Launchpad");
    const launchpad = Launchpad.attach(launchpadAddress);
    
    // Kiểm tra thông tin launchpad
    console.log("\n📋 Launchpad Info:");
    console.log("Rate:", await launchpad.rate(), "tokens per ETH");
    console.log("Start Time:", new Date(Number(await launchpad.startTime()) * 1000));
    console.log("End Time:", new Date(Number(await launchpad.endTime()) * 1000));
    console.log("Hard Cap:", hre.ethers.formatEther(await launchpad.hardCap()), "ETH");
    console.log("Total Raised:", hre.ethers.formatEther(await launchpad.totalRaised()), "ETH");
    
    // Kiểm tra token balance của launchpad
    const launchpadBalance = await token.balanceOf(launchpadAddress);
    console.log("Launchpad Token Balance:", hre.ethers.formatEther(launchpadBalance), "YTK");
    
    // Kiểm tra thời gian hiện tại
    const currentTime = Math.floor(Date.now() / 1000);
    const startTime = Number(await launchpad.startTime());
    const endTime = Number(await launchpad.endTime());
    
    console.log("\n⏰ Time Status:");
    console.log("Current Time:", new Date(currentTime * 1000));
    console.log("Sale Active:", currentTime >= startTime && currentTime <= endTime);
    
    if (currentTime < startTime) {
        console.log("⏳ Sale hasn't started yet. Wait", startTime - currentTime, "seconds.");
        return;
    }
    
    if (currentTime > endTime) {
        console.log("⏰ Sale has ended.");
        return;
    }
    
    // Mô phỏng mua token
    console.log("\n💰 Simulating Token Purchase...");
    
    try {
        // Buyer1 mua 0.5 ETH worth of tokens
        const ethAmount = hre.ethers.parseEther("0.5");
        console.log(`Buyer1 purchasing with ${hre.ethers.formatEther(ethAmount)} ETH...`);
        
        const tx = await launchpad.connect(buyer1).buyTokens({ value: ethAmount });
        await tx.wait();
        
        // Kiểm tra kết quả
        const buyer1TokenBalance = await token.balanceOf(buyer1.address);
        const buyer1Contribution = await launchpad.contributions(buyer1.address);
        const newTotalRaised = await launchpad.totalRaised();
        
        console.log("✅ Purchase successful!");
        console.log("Buyer1 Token Balance:", hre.ethers.formatEther(buyer1TokenBalance), "YTK");
        console.log("Buyer1 Contribution:", hre.ethers.formatEther(buyer1Contribution), "ETH");
        console.log("Total Raised:", hre.ethers.formatEther(newTotalRaised), "ETH");
        
    } catch (error) {
        console.log("❌ Purchase failed:", error.message);
    }
    
    // Buyer2 cũng mua
    try {
        const ethAmount2 = hre.ethers.parseEther("1");
        console.log(`\nBuyer2 purchasing with ${hre.ethers.formatEther(ethAmount2)} ETH...`);
        
        const tx2 = await launchpad.connect(buyer2).buyTokens({ value: ethAmount2 });
        await tx2.wait();
        
        const buyer2TokenBalance = await token.balanceOf(buyer2.address);
        const buyer2Contribution = await launchpad.contributions(buyer2.address);
        const finalTotalRaised = await launchpad.totalRaised();
        
        console.log("✅ Purchase successful!");
        console.log("Buyer2 Token Balance:", hre.ethers.formatEther(buyer2TokenBalance), "YTK");
        console.log("Buyer2 Contribution:", hre.ethers.formatEther(buyer2Contribution), "ETH");
        console.log("Final Total Raised:", hre.ethers.formatEther(finalTotalRaised), "ETH");
        
    } catch (error) {
        console.log("❌ Purchase failed:", error.message);
    }
    
    // Owner withdraw ETH
    console.log("\n💸 Owner withdrawing ETH...");
    try {
        const ownerBalanceBefore = await hre.ethers.provider.getBalance(owner.address);
        
        const withdrawTx = await launchpad.withdraw();
        await withdrawTx.wait();
        
        const ownerBalanceAfter = await hre.ethers.provider.getBalance(owner.address);
        
        console.log("✅ Withdrawal successful!");
        console.log("Owner received ETH (minus gas)");
        
    } catch (error) {
        console.log("❌ Withdrawal failed:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
