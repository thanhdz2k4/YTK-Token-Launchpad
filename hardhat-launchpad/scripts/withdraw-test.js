async function main() {
  console.log("🔓 Testing withdrawal after unlock time...");
  
  // Get the deployed contract address (you'll need to update this)
  const contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    console.log("❌ Please set CONTRACT_ADDRESS environment variable");
    console.log("Example: $env:CONTRACT_ADDRESS=\"0x...\"");
    return;
  }
  
  // Get accounts
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  
  // Get contract instance
  const Lock = await ethers.getContractFactory("Lock");
  const lock = Lock.attach(contractAddress);
  
  // Check current time vs unlock time
  const unlockTime = await lock.unlockTime();
  const currentTime = Math.floor(Date.now() / 1000);
  
  console.log("Current time:", new Date(currentTime * 1000).toLocaleString());
  console.log("Unlock time:", new Date(Number(unlockTime) * 1000).toLocaleString());
  
  if (currentTime < unlockTime) {
    console.log("⏰ Still locked! Wait", Number(unlockTime) - currentTime, "more seconds");
    return;
  }
  
  // Check balances before withdrawal
  const contractBalance = await ethers.provider.getBalance(contractAddress);
  const deployerBalanceBefore = await ethers.provider.getBalance(deployer.address);
  
  console.log("Contract balance before:", ethers.formatEther(contractBalance), "ETH");
  console.log("Deployer balance before:", ethers.formatEther(deployerBalanceBefore), "ETH");
  
  // Attempt withdrawal
  console.log("\n💸 Attempting withdrawal...");
  try {
    const tx = await lock.withdraw();
    const receipt = await tx.wait();
    
    console.log("✅ Withdrawal successful!");
    console.log("Transaction hash:", tx.hash);
    console.log("Gas used:", receipt.gasUsed.toString());
    
    // Check balances after withdrawal
    const contractBalanceAfter = await ethers.provider.getBalance(contractAddress);
    const deployerBalanceAfter = await ethers.provider.getBalance(deployer.address);
    
    console.log("\nContract balance after:", ethers.formatEther(contractBalanceAfter), "ETH");
    console.log("Deployer balance after:", ethers.formatEther(deployerBalanceAfter), "ETH");
    
  } catch (error) {
    console.log("❌ Withdrawal failed:", error.reason || error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
