// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @custom:oz-upgrades
contract VendingMachineV1 is Initializable {

    // --- errors ---
    // --- types ---
    // --- state ---
    uint8 private _version;

    // --- events ---
    // --- modifiers ---
    // --- fns ---
    function initilize() public initializer {
        _version = 1;
    }

    function version() public view returns (uint8) {
        return _version;
    }

}
