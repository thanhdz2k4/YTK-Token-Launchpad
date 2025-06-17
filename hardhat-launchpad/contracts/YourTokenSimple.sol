// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YourTokenSimple is ERC20 {
    constructor() ERC20("YourToken", "YTK") {
        // Mint 1 million tokens (1,000,000 * 10^18)
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}
