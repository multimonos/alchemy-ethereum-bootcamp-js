// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Multisig} from "./Multisig.sol";

contract MultisigTest is Test {

    Multisig public con;
    uint public required = 3;
    address[] public owners;
    address enemy;

    function setUp() external {
        enemy = makeAddr('enemy');
        owners.push(makeAddr('zero'));
        owners.push(makeAddr('one'));
        owners.push(makeAddr('two'));
        owners.push(makeAddr('three'));
        con = new Multisig(owners, required);
    }

    function test_construct_adds_owners() public view {
        for (uint i = 0; i < owners.length; i++) {
            assertEq(con.owners(i), owners[i]);
        }
    }

    function test_construct_sets_required_threshold() public view {
        assertEq(con.required(), required);
    }

    function test_construct_creates_empty_txn_list() public view {
        assertEq(con.transactionCount(), 0);
    }

    function test_construct_reverts_if_owners_empty() public {
        vm.expectRevert(Multisig.OwnersRequired.selector);
        address[] memory list;
        new Multisig(list, required);
    }

    function test_construct_reverts_if_signature_threshold_zero() public {
        vm.expectRevert(Multisig.SignatureThresholdMustBeNonZero.selector);
        address[] memory list = new address[](1);
        list[0] = makeAddr('zero');
        new Multisig(list, 0);
    }

    function test_construct_reverts_if_signature_threshold_gt_accounts() public {
        vm.expectRevert(Multisig.SignatureThresholdTooLarge.selector);
        address[] memory list = new address[](1);
        list[0] = makeAddr('zero');
        new Multisig(list, 2);
    }

    function test_transaction_create() public {
        address recipient = makeAddr('zero');
        uint value = 2 ether;

        vm.prank(owners[0]);
        uint txid = con.addTransaction(recipient, value);
        (address txRecipient, uint txValue, bool txExecuted) = con.transactions(txid);

        assertTrue(txid == 0);
        assertEq(con.transactionCount(), 1);
        assertEq(txRecipient, recipient);
        assertEq(txValue, value);
        assertFalse(txExecuted);
    }

    function test_transaction_initially_not_confirmed() public {
        address recipient = makeAddr('r0');
        uint value = 2 ether;

        vm.prank(owners[0]);
        uint txid = con.addTransaction(recipient, value);

        assertTrue(txid == 0);
        for (uint i = 0; i < owners.length; i++) {
            address owner = owners[i];
            assertFalse(con.confirmedBy(owner, txid));
        }
        assertEq(con.getConfirmationsCount(txid), 0);
    }

    function test_confirm_transaction() public {
        // setup
        address recipient = makeAddr('r0');
        uint value = 2 ether;

        vm.prank(owners[0]);
        uint txid = con.addTransaction(recipient, value);

        // action
        vm.prank(owners[0]);
        con.confirmTransaction(txid);

        vm.prank(owners[1]);
        con.confirmTransaction(txid);

        // measure
        assertTrue(con.confirmedBy(owners[0], txid));
        assertTrue(con.confirmedBy(owners[1], txid));
        assertEq(con.getConfirmationsCount(txid), 2);
    }

    function test_confirm_by_owner_only() public {
        // setup
        address recipient = makeAddr('r0');
        uint value = 2 ether;

        vm.prank(owners[0]);
        uint txid = con.addTransaction(recipient, value);

        // action
        vm.prank(enemy);
        vm.expectRevert(Multisig.OnlyOwner.selector);
        con.confirmTransaction(txid);
    }

    function test_submit_by_owner_only() public {
        // setup
        address recipient = makeAddr('r0');
        uint value = 2 ether;

        // action
        vm.prank(enemy);
        vm.expectRevert(Multisig.OnlyOwner.selector);
        con.submitTransaction(recipient, value);
    }

    function test_submit_auto_confirms() public {
        // setup
        address recipient = makeAddr('r0');
        uint value = 2 ether;

        // action
        vm.prank(owners[0]);
        uint txid = con.submitTransaction(recipient, value);

        // measure
        assertTrue(con.confirmedBy(owners[0], txid));
        assertEq(con.getConfirmationsCount(txid), 1);
    }

    function test_can_receive_funds() public {
        uint value = 3 ether;
        assertEq(address(con).balance, 0);

        (bool ok,) = address(con).call{value: value}('');
        assertTrue(ok);
        assertEq(address(con).balance, value);
    }

    function test_is_confirmed_initially_falses() public {
        // setup
        address recipient = makeAddr('r0');
        uint value = 2 ether;

        // act
        vm.prank(owners[0]);
        uint txid = con.addTransaction(recipient, value);

        //measure
        assertFalse(con.isConfirmed(txid));
    }

    function test_is_confirmed() public {
        // setup
        address recipient = makeAddr('r0');
        uint value = 2 ether;
        vm.deal(address(con), 3 * value);

        // act
        vm.prank(owners[0]);
        uint txid = con.submitTransaction(recipient, value);

        for (uint i = 1; i < owners.length; i++) {
            vm.prank(owners[i]);
            con.confirmTransaction(txid);
        }

        //measure
        assertEq(con.getConfirmationsCount(txid), owners.length);
        assertTrue(con.isConfirmed(txid));
    }

    function test_execute_fails_if_not_confirmed() public {
        // setup
        address recipient = makeAddr('r0');
        uint value = 2 ether;

        vm.prank(owners[0]);
        uint txid = con.submitTransaction(recipient, value);

        assertEq(con.getConfirmationsCount(txid), 1);
        assertTrue(required > 1);
        assertFalse(con.isConfirmed(txid));

        // act
        vm.expectRevert(Multisig.OnlyConfirmed.selector);
        con.executeTransaction(txid);
    }

    function test_execute_success() public {
        // setup
        uint value = 2 ether;

        // contract has funds
        vm.deal(address(con), 3 * value);

        // txn def
        address recipient = makeAddr('r0');
        assertEq(recipient.balance, 0);

        // submit txn
        vm.prank(owners[0]);
        uint txid = con.submitTransaction(recipient, value);

        // confirm by at least required persons
        for (uint i = 0; i < required; i++) {
            vm.prank(owners[i]);
            con.confirmTransaction(txid);
        }

        assertEq(con.getConfirmationsCount(txid), required);
        assertTrue(required <= con.getConfirmationsCount(txid));
        assertTrue(con.isConfirmed(txid));

        // act
        con.executeTransaction(txid);

        // measure
        assertEq(recipient.balance, value);
    }

     function test_auto_execution() public {
         // setup
         uint value = 2 ether;

         // contract has funds
         vm.deal(address(con), 3 * value);
         assertEq(address(con).balance,3*value);

         // txn def
         address recipient = makeAddr('r0');
         assertEq(recipient.balance, 0);

         // submit txn
         vm.prank(owners[0]);
         uint txid = con.addTransaction(recipient, value);

         // confirm by at least required persons
         for (uint i = 0; i < required-1; i++) {
             vm.prank(owners[i]);
             con.confirmTransaction(txid);
         }

         assertEq(con.getConfirmationsCount(txid), required-1);
         assertFalse(con.isConfirmed(txid));

         //act
         vm.prank(owners[required]);
         con.confirmTransaction(txid);

         // measure
         assertTrue(con.isConfirmed(txid));
         assertEq(recipient.balance, value);
     }
}
