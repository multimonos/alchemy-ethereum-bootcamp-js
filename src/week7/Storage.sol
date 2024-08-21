// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Storage {

    // --- value type ---
    uint256 private _slot0 = 5; // 0x0
    uint256 private _slot1 = 23; // 0x1
    uint256 private _slot2 = 666; // 0x2

    // --- mapping type ---

    // The mapping is potentially storing an infinite
    // qty of values.
    // Value is stored at the keccak256( key + 0x3 ).
    // See contstructor for examples.
    mapping(uint => uint) private _slot3; // 0x3

    constructor() {
        // stored at keccak256(0x5 + 0x3)
        _slot3[5] = 555;

        // stored at keccak256(0x7 + 0x3)
        _slot3[7] = 777;

        // stored at keccak256(0x9 + 0x3)
        _slot3[9] = 999;
    }

}
