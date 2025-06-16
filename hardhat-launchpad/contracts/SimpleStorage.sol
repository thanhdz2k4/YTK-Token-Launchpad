// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SimpleStorage {
    // State variables
    uint256 private favoriteNumber;
    string private message;
    address public owner;
    
    // Events
    event NumberUpdated(uint256 newNumber, address updatedBy);
    event MessageUpdated(string newMessage, address updatedBy);
    
    // Constructor
    constructor() {
        owner = msg.sender;
        favoriteNumber = 0;
        message = "Hello, Blockchain!";
    }
    
    // Functions to set values
    function setFavoriteNumber(uint256 _favoriteNumber) public {
        favoriteNumber = _favoriteNumber;
        emit NumberUpdated(_favoriteNumber, msg.sender);
    }
    
    function setMessage(string memory _message) public {
        message = _message;
        emit MessageUpdated(_message, msg.sender);
    }
    
    // Functions to get values
    function getFavoriteNumber() public view returns (uint256) {
        return favoriteNumber;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
    
    // Function to get contract info
    function getContractInfo() public view returns (uint256, string memory, address) {
        return (favoriteNumber, message, owner);
    }
    
    // Simple calculator functions
    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a + b;
    }
    
    function multiply(uint256 a, uint256 b) public pure returns (uint256) {
        return a * b;
    }
}
