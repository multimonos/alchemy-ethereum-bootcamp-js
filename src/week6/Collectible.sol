// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Ownable {
    // --- errors ---
    error OnlyOwner();

    // --- state ---
    address internal _owner; // cannot be private

    // --- modifiers ---
    modifier onlyOwner() {
        if (_owner != msg.sender) revert OnlyOwner();
        _;
    }

    // --- fns ---
    constructor() {
        _owner = msg.sender;
    }
}

contract Transferable is Ownable {
    // --- fns ---
    function transfer(address newOwner) external onlyOwner {
        _owner = newOwner;
    }
}

contract Collectible is Ownable, Transferable {
    // --- state ---
    uint public price;

    // --- fns ---
    function markPrice(uint cost) external onlyOwner {
        price = cost;
    }
}
