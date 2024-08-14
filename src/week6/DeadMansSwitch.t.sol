// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {DeadMansSwitch} from "./DeadMansSwitch.sol";

contract DeadMansSwitchTest is Test {

    DeadMansSwitch public dms;
    address public owner;
    address public recipient;
    address public enemy;
    uint public deposit = 25 ether;

    function setUp() external {
        enemy = makeAddr('enemy');
        owner = makeAddr('owner');
        recipient = makeAddr('recipient');

        // create
        vm.deal(owner, 3 * deposit);
        vm.prank(owner);
        dms = new DeadMansSwitch{value: deposit}(recipient);
    }

    function test_ping_can_only_be_called_by_owner() public {
        vm.expectRevert(DeadMansSwitch.OnlyOwner.selector);
        vm.prank(enemy);
        dms.ping();
    }

    function test_recipient_has_zero_balance_initially() public view {
        assertEq(address(recipient).balance, 0);
    }

    function test_withdraw_too_soon_reverts() public {
        vm.expectRevert(DeadMansSwitch.Locked.selector);
        vm.prank(recipient);
        dms.withdraw();
    }

    function test_withdraw_by_recipient_only() public {
        vm.expectRevert(DeadMansSwitch.OnlyRecipient.selector);
        vm.prank(enemy);
        dms.withdraw();
    }

    function test_withraw_transfers_funds_to_recipient() public {
        vm.warp(block.timestamp + 53 weeks);
        vm.prank(recipient);
        dms.withdraw();
        assertEq(address(recipient).balance, deposit);
    }

    function test_ping_works_to_block_withdraw() public {
        vm.startPrank(recipient);

        vm.expectRevert(DeadMansSwitch.Locked.selector);
        dms.withdraw();

        vm.expectRevert(DeadMansSwitch.Locked.selector);
        skip(25 weeks);
        dms.withdraw();
        vm.stopPrank();

        skip(60 weeks);
        vm.prank(owner);
        dms.ping();

        skip(51 weeks);
        vm.expectRevert(DeadMansSwitch.Locked.selector);
        vm.prank(recipient);
        dms.withdraw();
        assertEq(address(recipient).balance, 0);

        skip(1 weeks);
        vm.prank(recipient);
        dms.withdraw();
        assertEq(address(recipient).balance, deposit);
    }
}
