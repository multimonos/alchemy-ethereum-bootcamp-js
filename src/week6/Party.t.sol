// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Party}from "./Party.sol";

contract PartyTest is Test {

    Party public party;
    address public owner;
    uint public entryfee=3 ether;

    // venue
    address public venue;

    //members
//    string[] public names;
    address[] public users;
    uint public ubal = 25 ether;

    function setUp() external {
        venue = makeAddr('venu');

        // setup members with 5 ether
        users.push(makeAddr('one'));
        users.push(makeAddr('two'));
        users.push(makeAddr('three'));
        users.push(makeAddr('four'));
        users.push(makeAddr('five'));

        for (uint i = 0; i < users.length; i++) {
            vm.deal(users[i], ubal);
        }

        // other setup
        owner = makeAddr('owner');

        //create
        vm.prank(owner);
        party = new Party(entryfee);
    }

    function test_contract_balance_initially_zero() public view {
        assertEq(address(party).balance, 0);
    }

    function test_rsvp_requires_entryfee() public {
        vm.expectRevert(Party.InvalidEntryfee.selector);
        vm.prank(users[0]);
        party.rsvp();
    }

    function test_rsvp_requires_exact_deposit() public {
        // under
        vm.expectRevert(Party.InvalidEntryfee.selector);
        vm.prank(users[0]);
        party.rsvp{value: entryfee - 1 wei}();
        // over
        vm.expectRevert(Party.InvalidEntryfee.selector);
        vm.prank(users[1]);
        party.rsvp{value: entryfee + 1 wei}();
        // exact
        vm.prank(users[2]);
        party.rsvp{value: entryfee}();
    }

    function test_rsvp_once_only() public {
        vm.startPrank(users[0]);
        party.rsvp{value: entryfee}();
        vm.expectRevert(Party.DuplicateRsvp.selector);
        party.rsvp{value: entryfee}();
        vm.stopPrank();
    }

    function test_rsvp_deducts_entryfee_from_user() public {
        for (uint i = 0; i < users.length; i++) {
            // assert initial balalnce
            assertEq(users[i].balance, ubal);
            //rsvp
            vm.prank(users[i]);
            party.rsvp{value: entryfee}();
            // assert final balance
            assertEq(users[i].balance, ubal - entryfee);
        }
    }

    function test_rsvp_adds_funds_to_party() public {
        for (uint i = 0; i < users.length; i++) {
            vm.prank(users[i]);
            party.rsvp{value: entryfee}();
        }
        assertEq(address(party).balance, entryfee * users.length);
    }

    function test_venue_balance_initially_zero() public view {
        assertEq(venue.balance, 0);
    }

    function test_payBill_sends_funds_to_venue() public {
        uint cost = 9 ether;

        for (uint i = 0; i < users.length; i++) {
            vm.prank(users[i]);
            party.rsvp{value: entryfee}();
        }

        party.payBill(venue, cost);
        assertEq(venue.balance, cost);
    }

    function test_payBill_distributes_remaining_funds_to_users() public {
        //setup
        uint cost = 10 ether;
        uint input = entryfee * users.length;
        uint delta = input - cost;
        uint userPayout = delta / users.length;

        for (uint i = 0; i < users.length; i++) {
            vm.prank(users[i]);
            party.rsvp{value: entryfee}();
            input += entryfee;
        }

        // action
        party.payBill(venue, cost);

        // measure
        console.logUint(delta);
        console.logUint(users.length);
        assertTrue(input > 0);
        assertTrue(delta > 0);
        assertEq(venue.balance, cost);

        for (uint i = 0; i < users.length; i++) {
            assertEq(users[i].balance, ubal - entryfee + userPayout);
        }
    }
}