// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;


import {FooLibrary} from "./FooLibrary.sol";

contract FooLibraryConsumer {

    uint public x;

    constructor() {
        x = FooLibrary.add(7,14);
    }
}
