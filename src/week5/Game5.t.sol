// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Game5} from "./Game5.sol";

contract Game5Test is Test {

    function test_initial_state() public  {
        Game5 game = new Game5();

        vm.expectRevert();
        game.win();
        assertFalse(game.isWon());
    }

    function test_win() public {
        Game5 game = new Game5();

        vm.prank(address(2));
        game.win();

        assertTrue(game.isWon());

    }

}

