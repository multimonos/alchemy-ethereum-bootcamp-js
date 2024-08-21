// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";

import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {ConfigFactory} from "./ConfigFactory.sol";
import {VendingMachineV2} from "./VendingMachineV2.sol";

contract UpgradeVendingMachine is Script {

    function run() external {

        // config
        ConfigFactory factory = new ConfigFactory();
        ConfigFactory.Config memory config = factory.get(block.chainid);
        factory.log(config);

        uint privateKey = vm.envUint(config.PrivateKeyVarname);

        // upgrade
        vm.startBroadcast(privateKey);

        Upgrades.upgradeProxy(
            config.ProxyContractAddress,
            "VendingMachineV2.sol",
            ""
        );

        vm.stopBroadcast();
    }
}