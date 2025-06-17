// Mock contract addresses for testing
const MOCK_ADDRESSES = {
    token: "0x1234567890123456789012345678901234567890",
    launchpad: "0x0987654321098765432109876543210987654321",
    network: "sepolia-test"
};

console.log("📋 MOCK DEPLOYMENT FOR TESTING:");
console.log("=".repeat(50));
console.log("🪙 Token Address:", MOCK_ADDRESSES.token);
console.log("🚀 Launchpad Address:", MOCK_ADDRESSES.launchpad);
console.log("🌐 Network: Sepolia Testnet (Mock)");
console.log("=".repeat(50));

console.log("\n✅ Mock addresses generated for testing!");
console.log("📝 These addresses will work for frontend testing");
console.log("💡 Once you have real Infura API key, use deploy-sepolia.js");

// Save mock addresses
const fs = require('fs');
const addresses = {
    network: "sepolia-mock",
    token: MOCK_ADDRESSES.token,
    launchpad: MOCK_ADDRESSES.launchpad,
    deployer: "0xa17a600e32B008e8f8e4A615BBc6eFA0ecD73057",
    timestamp: new Date().toISOString(),
    note: "Mock addresses for testing - not real deployed contracts"
};

fs.writeFileSync('deployed-addresses.json', JSON.stringify(addresses, null, 2));
console.log("\n💾 Mock addresses saved to deployed-addresses.json");
