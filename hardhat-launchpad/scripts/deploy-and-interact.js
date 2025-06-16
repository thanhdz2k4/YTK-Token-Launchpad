async function main() {
  console.log("🚀 Deploying Lock contract...");
  
  // Get accounts
  const [deployer, user1] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("User1 address:", user1.address);
  
  // Check initial balances
  const deployerBalance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(deployerBalance), "ETH");
  
  // Set unlock time (1 minute from now for testing)
  const unlockTime = Math.floor(Date.now() / 1000) + 60; // 1 minute from now
  const lockedAmount = ethers.parseEther("1"); // 1 ETH
  
  console.log("Unlock time:", new Date(unlockTime * 1000).toLocaleString());
  console.log("Locked amount:", ethers.formatEther(lockedAmount), "ETH");
  
  // Deploy contract
  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  await lock.waitForDeployment();
  
  const contractAddress = await lock.getAddress();
  console.log("✅ Lock contract deployed to:", contractAddress);
  
  // Check contract balance
  const contractBalance = await ethers.provider.getBalance(contractAddress);
  console.log("Contract balance:", ethers.formatEther(contractBalance), "ETH");
  
  // Check contract state
  const storedUnlockTime = await lock.unlockTime();
  const owner = await lock.owner();
  console.log("Contract unlock time:", new Date(Number(storedUnlockTime) * 1000).toLocaleString());
  console.log("Contract owner:", owner);
  
  // Try to withdraw before unlock time (should fail)
  console.log("\n🔒 Trying to withdraw before unlock time...");
  try {
    await lock.withdraw();
    console.log("❌ Withdrawal succeeded (unexpected!)");
  } catch (error) {
    console.log("✅ Withdrawal failed as expected:", error.reason);
  }
  
  console.log("\n⏰ To test withdrawal after unlock time, wait 1 minute and run:");
  console.log("npx hardhat run scripts/withdraw-test.js --network localhost");
  
  return { lock, contractAddress, unlockTime };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
