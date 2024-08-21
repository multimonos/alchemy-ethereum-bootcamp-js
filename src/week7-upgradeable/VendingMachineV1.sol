// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


/// @custom:oz-upgrades
contract VendingMachineV1 is Initializable, OwnableUpgradeable {

    // --- state ---
    uint8 private _version;

    // --- fns ---
    function initialize() public initializer {
        __Ownable_init(msg.sender);
        _version = 1;
    }

    function version() external view returns (uint8) {
        return _version;
    }

    function baz() external pure returns (string memory) {
        return 'one:baz';
    }

}
