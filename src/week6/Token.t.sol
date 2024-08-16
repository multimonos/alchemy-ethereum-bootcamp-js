// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Token, TokenEvents} from "./Token.sol";

contract TokenTest is Test, TokenEvents {

    Token public tok;
    address public owner;
    uint public supply = 1000 ether;

    function setUp() external {
        owner = makeAddr('owner');

        vm.prank(owner);
        tok = new Token();
    }


    function test_total_supply() public view {
        assertEq(tok.totalSupply(), supply);
    }

    function test_name() public view {
        assertEq(tok.name(), "Foken");
    }

    function test_symbol() public view {
        assertEq(tok.symbol(), "FOK");
    }

    function test_decimals_is_18() public view {
        assertEq(tok.decimals(), 18);
    }

    function test_balanceof_returns_zero() public {
        address user = makeAddr('user');
        assertEq(tok.balanceOf(user), 0);
    }

    function test_create_assigns_supply_to_owner() public view {
        assertEq(tok.balanceOf(owner), supply);
    }

    function test_transfer_moves_funds_to_recipient() public {
        uint amount = 3 ether;
        address user = makeAddr('user');
        assertEq(tok.balanceOf(user), 0);
        assertEq(tok.balanceOf(owner), supply);

        vm.prank(owner);
        tok.transfer(user, amount);

        assertEq(tok.balanceOf(owner), supply - amount);
        assertEq(tok.balanceOf(user), amount);
    }

    function test_transfer_requires_sufficient_funds() public {
        uint amount = supply + 1 ether;
        address user = makeAddr('user');
        assertEq(tok.balanceOf(user), 0);
        assertEq(tok.balanceOf(owner), supply);

        vm.prank(owner);
        vm.expectRevert(Token.InsufficientFunds.selector);
        tok.transfer(user, amount);
    }

    function test_transfer_emits_Transfer_event() public {
        uint amount = 3 ether;
        address user = makeAddr('user');
        assertEq(tok.balanceOf(user), 0);
        assertEq(tok.balanceOf(owner), supply);

        vm.prank(owner);
        vm.expectEmit();
        emit Transfer(owner, user, amount);
        tok.transfer(user, amount);


    }
}
