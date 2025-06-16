async function main() {
  console.log("🔍 HARDHAT ACCOUNTS EXPLAINED");
  console.log("=====================================");
  
  // Lấy tất cả accounts
  const accounts = await ethers.getSigners();
  
  console.log(`📊 Có ${accounts.length} accounts có sẵn\n`);
  
  // Hiển thị 5 accounts đầu tiên
  for (let i = 0; i < Math.min(5, accounts.length); i++) {
    const account = accounts[i];
    const address = await account.getAddress();
    const balance = await ethers.provider.getBalance(address);
    
    console.log(`👤 Account ${i}:`);
    console.log(`   Address: ${address}`);
    console.log(`   Balance: ${ethers.formatEther(balance)} ETH`);
    console.log(`   Role: ${i === 0 ? 'Owner/Deployer' : i === 1 ? 'User1' : i === 2 ? 'User2' : 'Extra User'}`);
    console.log('');
  }
  
  console.log("💡 GIẢI THÍCH:");
  console.log("- Account 0: Thường dùng làm owner/deployer");
  console.log("- Account 1, 2, 3...: Dùng để test tương tác từ user khác");
  console.log("- Mỗi account có 10,000 ETH fake để test");
  console.log("- Địa chỉ và private key được tạo tự động");
  
  console.log("\n🌍 NETWORK INFO:");
  const network = await ethers.provider.getNetwork();
  console.log(`Network: ${network.name}`);
  console.log(`Chain ID: ${network.chainId}`);
  console.log(`Block Number: ${await ethers.provider.getBlockNumber()}`);
  
  // Demo transaction giữa accounts
  console.log("\n💸 DEMO CHUYỂN TIỀN:");
  const sender = accounts[0];
  const receiver = accounts[1];
  
  const senderBalanceBefore = await ethers.provider.getBalance(sender.address);
  const receiverBalanceBefore = await ethers.provider.getBalance(receiver.address);
  
  console.log(`Sender balance before: ${ethers.formatEther(senderBalanceBefore)} ETH`);
  console.log(`Receiver balance before: ${ethers.formatEther(receiverBalanceBefore)} ETH`);
  
  // Chuyển 1 ETH
  const tx = await sender.sendTransaction({
    to: receiver.address,
    value: ethers.parseEther("1.0")
  });
  await tx.wait();
  
  const senderBalanceAfter = await ethers.provider.getBalance(sender.address);
  const receiverBalanceAfter = await ethers.provider.getBalance(receiver.address);
  
  console.log(`\nSender balance after: ${ethers.formatEther(senderBalanceAfter)} ETH`);
  console.log(`Receiver balance after: ${ethers.formatEther(receiverBalanceAfter)} ETH`);
  console.log(`Transaction hash: ${tx.hash}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
