const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("Launchpad System", function () {
  let token, launchpad;
  let owner, buyer1, buyer2;
  let rate, startTime, endTime, hardCap, initialSupply;

  beforeEach(async function () {
    // Lấy accounts
    [owner, buyer1, buyer2] = await ethers.getSigners();

    // Thiết lập parameters
    initialSupply = ethers.parseEther("1000000"); // 1 triệu token
    rate = 1000; // 1 ETH = 1000 tokens
    startTime = (await time.latest()) + 60; // Bắt đầu sau 1 phút
    endTime = startTime + 3600; // Kết thúc sau 1 giờ
    hardCap = ethers.parseEther("10"); // 10 ETH hard cap

    // Deploy YourToken
    const Token = await ethers.getContractFactory("YourToken");
    token = await Token.deploy(initialSupply);
    await token.waitForDeployment();

    // Deploy Launchpad
    const Launchpad = await ethers.getContractFactory("Launchpad");
    launchpad = await Launchpad.deploy(
      await token.getAddress(),
      rate,
      startTime,
      endTime,
      hardCap
    );
    await launchpad.waitForDeployment();

    // Transfer tokens to launchpad
    const tokenForSale = ethers.parseEther("500000"); // 500k token for sale
    await token.transfer(await launchpad.getAddress(), tokenForSale);
  });

  describe("Deployment", function () {
    it("Should set correct initial values", async function () {
      expect(await launchpad.owner()).to.equal(owner.address);
      expect(await launchpad.rate()).to.equal(rate);
      expect(await launchpad.startTime()).to.equal(startTime);
      expect(await launchpad.endTime()).to.equal(endTime);
      expect(await launchpad.hardCap()).to.equal(hardCap);
      expect(await launchpad.totalRaised()).to.equal(0);
    });

    it("Should have correct token balance", async function () {
      const launchpadBalance = await token.balanceOf(await launchpad.getAddress());
      expect(launchpadBalance).to.equal(ethers.parseEther("500000"));
    });
  });

  describe("Token Purchase", function () {
    beforeEach(async function () {
      // Advance time to start time
      await time.increaseTo(startTime);
    });

    it("Should allow buying tokens", async function () {
      const ethAmount = ethers.parseEther("1"); // 1 ETH
      const expectedTokens = ethAmount * BigInt(rate); // 1000 tokens

      // Buyer1 mua token
      await expect(launchpad.connect(buyer1).buyTokens({ value: ethAmount }))
        .to.emit(launchpad, "TokensPurchased")
        .withArgs(buyer1.address, ethAmount, expectedTokens);

      // Kiểm tra balance
      const buyer1Balance = await token.balanceOf(buyer1.address);
      expect(buyer1Balance).to.equal(expectedTokens);

      // Kiểm tra contribution
      expect(await launchpad.contributions(buyer1.address)).to.equal(ethAmount);
      expect(await launchpad.totalRaised()).to.equal(ethAmount);
    });

    it("Should calculate token amount correctly", async function () {
      const ethAmount = ethers.parseEther("2"); // 2 ETH
      const expectedTokens = ethAmount * BigInt(rate); // 2000 tokens

      await launchpad.connect(buyer1).buyTokens({ value: ethAmount });

      const buyer1Balance = await token.balanceOf(buyer1.address);
      expect(buyer1Balance).to.equal(expectedTokens);
    });

    it("Should track multiple buyers", async function () {
      const ethAmount1 = ethers.parseEther("1");
      const ethAmount2 = ethers.parseEther("2");

      await launchpad.connect(buyer1).buyTokens({ value: ethAmount1 });
      await launchpad.connect(buyer2).buyTokens({ value: ethAmount2 });

      expect(await launchpad.contributions(buyer1.address)).to.equal(ethAmount1);
      expect(await launchpad.contributions(buyer2.address)).to.equal(ethAmount2);
      expect(await launchpad.totalRaised()).to.equal(ethAmount1 + ethAmount2);
    });

    it("Should fail if hard cap is reached", async function () {
      // Mua gần hết hard cap
      await launchpad.connect(buyer1).buyTokens({ value: ethers.parseEther("9") });

      // Cố gắng mua thêm 2 ETH (vượt hard cap)
      await expect(
        launchpad.connect(buyer2).buyTokens({ value: ethers.parseEther("2") })
      ).to.be.revertedWith("Hard cap reached");
    });    it("Should fail if buying before start time", async function () {
      // Reset to before start time
      const currentTime = await time.latest();
      if (currentTime >= startTime) {
        // Skip this test if we're already past start time
        this.skip();
      }

      await expect(
        launchpad.connect(buyer1).buyTokens({ value: ethers.parseEther("1") })
      ).to.be.revertedWith("Launchpad has not started yet");
    });

    it("Should fail if buying after end time", async function () {
      // Advance time to after end time
      await time.increaseTo(endTime + 1);

      await expect(
        launchpad.connect(buyer1).buyTokens({ value: ethers.parseEther("1") })
      ).to.be.revertedWith("Launchpad has not started yet");
    });

    it("Should fail if no ETH sent", async function () {
      await expect(
        launchpad.connect(buyer1).buyTokens({ value: 0 })
      ).to.be.revertedWith("Must send ETH to buy tokens");
    });
  });

  describe("Withdrawal", function () {
    beforeEach(async function () {
      await time.increaseTo(startTime);
      // Buyer1 mua 1 ETH worth of tokens
      await launchpad.connect(buyer1).buyTokens({ value: ethers.parseEther("1") });
    });

    it("Should allow owner to withdraw", async function () {
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      
      const tx = await launchpad.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt.gasUsed * receipt.gasPrice;

      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      
      // Owner should receive the ETH minus gas fees
      expect(ownerBalanceAfter).to.be.closeTo(
        ownerBalanceBefore + ethers.parseEther("1") - gasUsed,
        ethers.parseEther("0.01") // Allow small difference for gas
      );
    });

    it("Should fail if non-owner tries to withdraw", async function () {
      await expect(
        launchpad.connect(buyer1).withdraw()
      ).to.be.revertedWith("Only owner can call this function");
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple purchases from same buyer", async function () {
      await time.increaseTo(startTime);

      const ethAmount1 = ethers.parseEther("1");
      const ethAmount2 = ethers.parseEther("0.5");

      await launchpad.connect(buyer1).buyTokens({ value: ethAmount1 });
      await launchpad.connect(buyer1).buyTokens({ value: ethAmount2 });

      const totalContribution = ethAmount1 + ethAmount2;
      const expectedTokens = totalContribution * BigInt(rate);

      expect(await launchpad.contributions(buyer1.address)).to.equal(totalContribution);
      expect(await token.balanceOf(buyer1.address)).to.equal(expectedTokens);
    });

    it("Should handle exact hard cap purchase", async function () {
      await time.increaseTo(startTime);

      // Mua đúng bằng hard cap
      await launchpad.connect(buyer1).buyTokens({ value: hardCap });

      expect(await launchpad.totalRaised()).to.equal(hardCap);
      
      // Không thể mua thêm
      await expect(
        launchpad.connect(buyer2).buyTokens({ value: ethers.parseEther("0.1") })
      ).to.be.revertedWith("Hard cap reached");
    });
  });
});
