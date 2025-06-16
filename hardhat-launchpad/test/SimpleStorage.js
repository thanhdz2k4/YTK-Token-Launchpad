const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleStorage", function () {
  let simpleStorage;
  let owner, user1, user2;

  // Chạy trước mỗi test
  beforeEach(async function () {
    // Lấy accounts để test
    [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy contract
    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await SimpleStorage.deploy();
    await simpleStorage.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await simpleStorage.owner()).to.equal(owner.address);
    });

    it("Should initialize with default values", async function () {
      expect(await simpleStorage.getFavoriteNumber()).to.equal(0);
      expect(await simpleStorage.getMessage()).to.equal("Hello, Blockchain!");
    });
  });

  describe("Setting values", function () {
    it("Should update favorite number", async function () {
      // Set number to 42
      await simpleStorage.setFavoriteNumber(42);
      
      // Check if updated
      expect(await simpleStorage.getFavoriteNumber()).to.equal(42);
    });

    it("Should update message", async function () {
      const newMessage = "Hello Vietnam!";
      await simpleStorage.setMessage(newMessage);
      
      expect(await simpleStorage.getMessage()).to.equal(newMessage);
    });

    it("Should emit events when updating", async function () {
      // Test event emission
      await expect(simpleStorage.setFavoriteNumber(99))
        .to.emit(simpleStorage, "NumberUpdated")
        .withArgs(99, owner.address);
    });
  });

  describe("Calculator functions", function () {
    it("Should add numbers correctly", async function () {
      expect(await simpleStorage.add(5, 3)).to.equal(8);
      expect(await simpleStorage.add(0, 0)).to.equal(0);
      expect(await simpleStorage.add(100, 200)).to.equal(300);
    });

    it("Should multiply numbers correctly", async function () {
      expect(await simpleStorage.multiply(4, 5)).to.equal(20);
      expect(await simpleStorage.multiply(0, 10)).to.equal(0);
      expect(await simpleStorage.multiply(7, 8)).to.equal(56);
    });
  });

  describe("Multiple users", function () {
    it("Should allow different users to update values", async function () {
      // User1 sets favorite number
      await simpleStorage.connect(user1).setFavoriteNumber(123);
      expect(await simpleStorage.getFavoriteNumber()).to.equal(123);
      
      // User2 sets different number
      await simpleStorage.connect(user2).setFavoriteNumber(456);
      expect(await simpleStorage.getFavoriteNumber()).to.equal(456);
    });

    it("Should track who updated the value", async function () {
      // Test event with different user
      await expect(simpleStorage.connect(user1).setFavoriteNumber(777))
        .to.emit(simpleStorage, "NumberUpdated")
        .withArgs(777, user1.address);
    });
  });
});
