// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Launchpad {
    address public owner;
    IERC20 public token;

    uint256 public rate;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public hardCap;
    uint256 public totalRaised;

    mapping(address => uint256) public contributions;

    event TokensPurchased(address indexed buyer, uint256 ethAmount, uint256 tokenAmount);
    

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(
        address _token,
        uint256 _rate,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _hardCap
    ) {
        require(_token != address(0), "Token address cannot be zero");
        require(_rate > 0, "Rate must be greater than 0");
        require(_startTime < _endTime, "Start time must be before end time");
        require(_hardCap > 0, "Hard cap must be greater than 0");

        owner = msg.sender;
        token = IERC20(_token);
        rate = _rate;
        startTime = _startTime;
        endTime = _endTime;
        hardCap = _hardCap;
    }

    function buyTokens() external payable {
        require(block.timestamp >= startTime && block.timestamp <= endTime, "Launchpad has not started yet");
        require(msg.value > 0, "Must send ETH to buy tokens");
        require(totalRaised + msg.value <= hardCap, "Hard cap reached");

        uint256 tokenAmount = msg.value * rate;
        totalRaised += msg.value;
        contributions[msg.sender] += msg.value;

        require(token.transfer(msg.sender, tokenAmount), "Token transfer failed");
        emit TokensPurchased(msg.sender, msg.value, tokenAmount);
    }

    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
