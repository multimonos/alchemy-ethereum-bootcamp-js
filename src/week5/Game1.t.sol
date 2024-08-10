// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Game1} from "./Game1.sol";

contract Game1Test is Test {

    function test_initial_state() public  {
        Game1 game = new Game1();
        vm.expectRevert();
        game.win();
        assertFalse(game.isWon());
    }

    function test_win() public {
        Game1 game = new Game1();

        vm.expectRevert();
        game.win();
        assertFalse(game.isWon());

        game.unlock();
        game.win();
        assertTrue(game.isWon());
    }

}
