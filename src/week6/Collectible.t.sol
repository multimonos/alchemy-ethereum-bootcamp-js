// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Collectible, Ownable} from "./Collectible.sol";

contract CollectibleTest is Test {

    Collectible public  con;
    address public owner;
    address public bob;
    address public enemy;


    function setUp() external {
        owner = makeAddr('owner');
        bob = makeAddr('bob');
        enemy = makeAddr('enemy');

        vm.prank(owner);
        con = new Collectible();
    }

    function test_construct_price_is_zero() public view {
        assertEq(con.price(), 0);
    }

    function test_price_can_be_set_by_owner() public {
        uint price = 3 ether;
        vm.prank(owner);
        con.markPrice(price);
        assertEq(con.price(), price);
    }

    function test_set_price_by_owner_only() public {
        uint price = 3 ether;
        vm.prank(enemy);
        vm.expectRevert(Ownable.OnlyOwner.selector);
        con.markPrice(price);
    }

    function test_transfer_reverts_if_not_owner() public {
        vm.prank(enemy);
        vm.expectRevert(Ownable.OnlyOwner.selector);
        con.transfer(bob);
    }

}