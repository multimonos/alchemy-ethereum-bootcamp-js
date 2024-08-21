// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {VendingMachineV1} from "./VendingMachineV1.sol";
import {ConfigFactory} from "./ConfigFactory.sol";

contract DeployVendingMachine is Script {

    function run() external {

        // config
        ConfigFactory factory = new ConfigFactory();
        ConfigFactory.Config memory config = factory.get(block.chainid);
        factory.log(config);

        uint privateKey = vm.envUint(config.PrivateKeyVarname);
        address proxyAdmin = vm.envAddress(config.ProxyAdminAddressVarname);

        // deploy
        vm.startBroadcast(privateKey);

        address proxy = Upgrades.deployTransparentProxy(
            "VendingMachineV1.sol",
            proxyAdmin,
            abi.encodeCall(VendingMachineV1.initialize, ())
        );

        console.log('{ ProxyContractAddress: "%s" }', proxy);

        vm.stopBroadcast();
    }

}