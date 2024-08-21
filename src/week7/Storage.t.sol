// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";

contract StorageTest is Test {

    function test_true() public pure {
        uint256 key = 0x3;
        bytes32 bkey = bytes32(key);

        uint256 loc = 0x9;
        bytes32 bloc = bytes32(loc);

        bytes memory concat = abi.encodePacked(bloc, bkey);

        bytes32 hash = keccak256(concat);

        console.logBytes32(bkey);
        console.logBytes32(bloc);
        console.logBytes(concat);
        console.logBytes32(hash);
        assertEq(hash, 0x8a8dc4e5242ea8b1ab1d60606dae757e6c2cca9f92a2cced9f72c19960bcb458);
    }

    function test_zero_hash() public pure {
        uint256 a = 0x0;
        bytes32 b = bytes32(a);
        bytes memory c = abi.encodePacked(b);
        bytes32 h = keccak256(c);
        console.logUint(a);
        console.logBytes32(b);
        console.logBytes(c);
        console.logBytes32(h);

        assertEq(h, 0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563);
    }
}
