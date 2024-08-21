// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Storage} from "./Storage.sol";

contract DeployStorage is Script {

    function run() external {
        vm.startBroadcast();
        new Storage();
        vm.stopBroadcast();
    }

}