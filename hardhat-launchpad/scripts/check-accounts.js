async function main() {
  // Lấy tất cả signers (accounts)
  const signers = await ethers.getSigners();
  
  console.log("📋 Danh sách Accounts có sẵn:");
  console.log("=====================================");
  
  for (let i = 0; i < signers.length; i++) {
    const signer = signers[i];
    const address = await signer.getAddress();
    const balance = await ethers.provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);
    
    console.log(`Account ${i}:`);
    console.log(`  Address: ${address}`);
    console.log(`  Balance: ${balanceInEth} ETH`);
    console.log(`  Private Key: ${signer.privateKey || 'Hidden (use --show-private-keys)'}`);
    console.log("─────────────────────────────────────");
  }
  
  console.log(`\n🎯 Tổng cộng: ${signers.length} accounts`);
  
  // Thông tin về network
  const network = await ethers.provider.getNetwork();
  console.log(`\n🌐 Network: ${network.name} (Chain ID: ${network.chainId})`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
