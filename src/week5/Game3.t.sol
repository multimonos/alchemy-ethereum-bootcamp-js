// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Game3} from "./Game3.sol";

contract Game3Test is Test {

    function test_lose() public {
        Game3 game = new Game3();

        address a0 = makeAddr('one');
        address a1 = makeAddr('two');
        address a2 = makeAddr('three');

        vm.expectRevert();
        game.win(a0, a1, a2);

        assertFalse(game.isWon());
    }

    function test_win() public {
        Game3 game = new Game3();


        address a1 = makeAddr('two');
        vm.deal(a1, 5 ether);

        address a2 = makeAddr('three');
        vm.deal(a2, 5 ether);

        address a3 = makeAddr('one');
        vm.deal(a3, 5 ether);


        vm.prank(a1);
        game.buy{value: 2 ether}();

        vm.prank(a2);
        game.buy{value: 3 ether}();

        vm.prank(a3);
        game.buy{value: 1 ether}();

        game.win(a1, a2, a3);

        assertTrue(game.isWon());
    }
}
