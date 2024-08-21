// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @custom:oz-upgrades-from VendingMachineV1
contract VendingMachineV2 is Initializable {

    // --- errors ---
    // --- types ---
    // --- state ---
    uint8 private _version;

    // --- events ---
    // --- modifiers ---
    // --- fns ---
    function initilize() public initializer {
        _version = 2;
    }

    function version() public view returns (uint8){
        return _version;
    }
}
