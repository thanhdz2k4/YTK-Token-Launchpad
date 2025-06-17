// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LaunchpadAuto is Ownable, ReentrancyGuard {
    IERC20 public token;
    uint256 public rate; // tokens per 1 ETH
    uint256 public startTime;
    uint256 public endTime;
    uint256 public hardCap;
    uint256 public totalRaised;
    
    mapping(address => uint256) public contributions;
    address[] public contributors;
    
    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    event SaleFinalized();
    event FundsWithdrawn(uint256 amount);
    
    // Constructor đơn giản - chỉ cần token address và rate
    constructor(
        address _token,
        uint256 _rate  // tokens per 1 ETH (ví dụ: 1000)
    ) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        require(_rate > 0, "Rate must be greater than 0");
        
        token = IERC20(_token);
        rate = _rate;
        
        // Tự động thiết lập thời gian
        startTime = block.timestamp; // Bắt đầu ngay
        endTime = block.timestamp + 30 days; // Kết thúc sau 30 ngày
        hardCap = 100 ether; // Hard cap 100 ETH
        
        totalRaised = 0;
    }
    
    // Các function khác giống như contract Launchpad gốc
    function buyTokens() external payable nonReentrant {
        require(block.timestamp >= startTime, "Sale has not started");
        require(block.timestamp <= endTime, "Sale has ended");
        require(msg.value > 0, "Must send ETH");
        require(totalRaised + msg.value <= hardCap, "Hard cap exceeded");
        
        uint256 tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount, "Not enough tokens in contract");
        
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        
        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;
        
        require(token.transfer(msg.sender, tokenAmount), "Token transfer failed");
        
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }
    
    function getTimeInfo() external view returns (
        uint256 currentTime,
        uint256 saleStart,
        uint256 saleEnd,
        bool isActive
    ) {
        currentTime = block.timestamp;
        saleStart = startTime;
        saleEnd = endTime;
        isActive = (currentTime >= startTime && currentTime <= endTime);
    }
    
    function getSaleInfo() external view returns (
        uint256 _rate,
        uint256 _totalRaised,
        uint256 _hardCap,
        uint256 _tokensRemaining
    ) {
        _rate = rate;
        _totalRaised = totalRaised;
        _hardCap = hardCap;
        _tokensRemaining = token.balanceOf(address(this));
    }
    
    function getContributorCount() external view returns (uint256) {
        return contributors.length;
    }
    
    function withdrawFunds() external onlyOwner {
        require(block.timestamp > endTime, "Sale is still active");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
        
        emit FundsWithdrawn(balance);
    }
    
    function withdrawUnsoldTokens() external onlyOwner {
        require(block.timestamp > endTime, "Sale is still active");
        uint256 unsoldTokens = token.balanceOf(address(this));
        if (unsoldTokens > 0) {
            require(token.transfer(owner(), unsoldTokens), "Token withdrawal failed");
        }
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 tokenBalance = token.balanceOf(address(this));
        if (tokenBalance > 0) {
            require(token.transfer(owner(), tokenBalance), "Token withdrawal failed");
        }
        
        uint256 ethBalance = address(this).balance;
        if (ethBalance > 0) {
            (bool success, ) = payable(owner()).call{value: ethBalance}("");
            require(success, "ETH withdrawal failed");
        }
    }
}
