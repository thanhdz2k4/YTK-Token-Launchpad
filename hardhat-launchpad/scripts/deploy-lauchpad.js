const hre = require("hardhat");

async function main() {
    // 1. Deplay Token
    const initialSupply = hre.ethers.parseEther("1000000"); // 1 triệu token
    const Token = await hre.ethers.getContractFactory("YourToken");
    const token = await Token.deploy(initialSupply);
    await token.waitForDeployment();
    console.log("Token deployed to:", await token.getAddress());

    // 2. Deploy Launchpad
    const rate = 1000; // 1 ETH = 1000 tokens
    const startTime = Math.floor(Date.now() / 1000) + 60; // Bắt đầu sau 1 phút
    const endTime = startTime + 3600; // Kết thúc sau 1 giờ
    const hardCap = hre.ethers.parseEther("10"); // 10 ETH hard cap

    const Launchpad = await hre.ethers.getContractFactory("Launchpad");
    const launchpad = await Launchpad.deploy(
        token.getAddress(), 
        rate, 
        startTime,
        endTime,
        hardCap
    );
    await launchpad.waitForDeployment();
    console.log("Launchpad deployed to:", await launchpad.getAddress());

    // 3. Transfer token ownership to Launchpad
    const tokenForsale = hre.ethers.parseUnits("1000000", 18); // 1 triệu token
    await token.transfer(await launchpad.getAddress(), tokenForsale);
    console.log("Transferred 1 million tokens to Launchpad for sale");
}

// Run the main function and handle errors
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});