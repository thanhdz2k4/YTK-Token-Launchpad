async function main() {
  console.log("🎯 Deploying SimpleStorage contract...");
  
  // Get accounts
  const [deployer, user1] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("User1:", user1.address);
  
  // Deploy contract
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.waitForDeployment();
  
  const contractAddress = await simpleStorage.getAddress();
  console.log("✅ SimpleStorage deployed to:", contractAddress);
  
  // Test initial values
  console.log("\n📖 Reading initial values...");
  const initialNumber = await simpleStorage.getFavoriteNumber();
  const initialMessage = await simpleStorage.getMessage();
  const owner = await simpleStorage.owner();
  
  console.log("Initial favorite number:", initialNumber.toString());
  console.log("Initial message:", initialMessage);
  console.log("Owner:", owner);
  
  // Test setting new values
  console.log("\n✏️ Setting new values...");
  
  // Set favorite number
  console.log("Setting favorite number to 42...");
  const tx1 = await simpleStorage.setFavoriteNumber(42);
  await tx1.wait();
  
  // Set message
  console.log("Setting message to 'Hello from Vietnam!'...");
  const tx2 = await simpleStorage.setMessage("Hello from Vietnam!");
  await tx2.wait();
  
  // Read updated values
  console.log("\n📖 Reading updated values...");
  const newNumber = await simpleStorage.getFavoriteNumber();
  const newMessage = await simpleStorage.getMessage();
  
  console.log("Updated favorite number:", newNumber.toString());
  console.log("Updated message:", newMessage);
  
  // Test calculator functions
  console.log("\n🧮 Testing calculator functions...");
  const sum = await simpleStorage.add(10, 20);
  const product = await simpleStorage.multiply(5, 6);
  
  console.log("10 + 20 =", sum.toString());
  console.log("5 × 6 =", product.toString());
  
  // Test from different account
  console.log("\n👤 Testing from different account...");
  const simpleStorageUser1 = simpleStorage.connect(user1);
  
  console.log("User1 setting favorite number to 99...");
  const tx3 = await simpleStorageUser1.setFavoriteNumber(99);
  await tx3.wait();
  
  const finalNumber = await simpleStorage.getFavoriteNumber();
  console.log("Final favorite number:", finalNumber.toString());
  
  // Get all contract info at once
  console.log("\n📋 Contract summary:");
  const [number, message, contractOwner] = await simpleStorage.getContractInfo();
  console.log("Favorite Number:", number.toString());
  console.log("Message:", message);
  console.log("Owner:", contractOwner);
  
  console.log("\n🎉 All tests completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
