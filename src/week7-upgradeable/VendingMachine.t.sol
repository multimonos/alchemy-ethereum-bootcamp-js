// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";

import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import {VendingMachineV1} from "./VendingMachineV1.sol";
import {VendingMachineV2} from "./VendingMachineV2.sol";

interface VendingMachine {
    // v1
    function version() external view returns (uint8);

    function getBaz() external pure returns (string memory);
    // v2
    function getFoobar() external pure returns (string memory);

}

contract VendingMachineTest is Test {

    bool public shouldUpgrade = true;

    address public proxy;
    address public proxyAdmin;
    address public eoa;
    uint8 public version;

    function setUp() external {
        proxyAdmin = makeAddr('proxy-admin');
        console.log('proxyAdmin: %s', proxyAdmin);

        // deploy
        vm.prank(proxyAdmin);
        proxy = Upgrades.deployTransparentProxy(
            "VendingMachineV1.sol",
            proxyAdmin,
            abi.encodeCall(VendingMachineV1.initialize, ())
        );

        // upgrade
        if (shouldUpgrade) {

            vm.prank(proxyAdmin);

            Upgrades.upgradeProxy(
                proxy,
                "VendingMachineV2.sol",
                "" // don't call any specific methods on upgrade
            );
        }

        // version
        version = VendingMachine(proxy).version();

        console.log('proxy : %s', address(proxy));
        console.log('version : %s', version);
    }

    // --- version 1 ---

    function test_version_one() public {
        vm.skip(version > 1);
    }

    function test_v1_getBaz() public {
        vm.skip(version > 1);
        string memory s = VendingMachine(proxy).getBaz();
        assertEq(s, 'one:baz');
    }

    // --- version 2 ---
    function test_v2_getBaz() public {
        vm.skip(version < 2);
        string memory s = VendingMachine(proxy).getBaz();
        assertEq(s, 'two:baz');
    }

    function test_v2_getFoobar() public {
        vm.skip(version < 2);
        string memory s = VendingMachine(proxy).getFoobar();
        assertEq(s, 'foobar');
    }

//    function test_version_two() public {
//        vm.skip(version < 2);
//        assertEq(2, version);
//    }
//
//    function test_getBaz_1() public {
//        vm.skip(version > 1);
//        string memory s = VendingMachine(proxy).getBaz();
//        assertEq(s, 'one:baz');
//    }

}
