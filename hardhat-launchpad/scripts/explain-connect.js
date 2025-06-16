async function explainConnect() {
  console.log("🔗 Giải thích Contract.connect()");
  
  // 1. Lấy accounts
  const [deployer, user1, user2] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("User1 address:", user1.address);
  console.log("User2 address:", user2.address);
  
  // 2. Deploy contract
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.waitForDeployment();
  
  console.log("\n📦 Contract deployed by:", deployer.address);
  console.log("Contract owner:", await simpleStorage.owner());
  
  // 3. Contract instance gốc (kết nối với deployer)
  console.log("\n🏠 Using original contract instance (from deployer):");
  await simpleStorage.setFavoriteNumber(42);
  console.log("Favorite number set to 42 by:", deployer.address);
  
  // 4. Tạo contract instance kết nối với user1
  console.log("\n👤 Creating contract instance connected to user1:");
  const simpleStorageUser1 = simpleStorage.connect(user1);
  
  // Kiểm tra xem 2 instance có khác nhau không
  console.log("Original contract address:", await simpleStorage.getAddress());
  console.log("User1 contract address:", await simpleStorageUser1.getAddress());
  console.log("Same contract? Yes, same address!");
  
  // 5. Gọi function từ user1
  console.log("\n✏️ User1 setting favorite number to 99:");
  await simpleStorageUser1.setFavoriteNumber(99);
  console.log("Favorite number set to 99 by:", user1.address);
  
  // 6. Tạo contract instance kết nối với user2
  console.log("\n👥 Creating contract instance connected to user2:");
  const simpleStorageUser2 = simpleStorage.connect(user2);
  await simpleStorageUser2.setFavoriteNumber(777);
  console.log("Favorite number set to 777 by:", user2.address);
  
  // 7. Đọc giá trị cuối cùng (từ bất kỳ instance nào)
  console.log("\n📖 Reading final value from any instance:");
  console.log("From original:", (await simpleStorage.getFavoriteNumber()).toString());
  console.log("From user1 instance:", (await simpleStorageUser1.getFavoriteNumber()).toString());
  console.log("From user2 instance:", (await simpleStorageUser2.getFavoriteNumber()).toString());
  console.log("All same value? Yes! Same contract state.");
  
  // 8. Kiểm tra gas fees
  console.log("\n⛽ Checking balances (who paid gas):");
  const deployerBalance = await ethers.provider.getBalance(deployer.address);
  const user1Balance = await ethers.provider.getBalance(user1.address);
  const user2Balance = await ethers.provider.getBalance(user2.address);
  
  console.log("Deployer balance:", ethers.formatEther(deployerBalance), "ETH");
  console.log("User1 balance:", ethers.formatEther(user1Balance), "ETH");  
  console.log("User2 balance:", ethers.formatEther(user2Balance), "ETH");
  console.log("(Each account started with 10,000 ETH)");
}

explainConnect()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
