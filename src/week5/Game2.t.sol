// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Game2} from "./Game2.sol";

contract Game2Test is Test {

    function test_initial_state() public {
        Game2 game = new Game2();
        vm.expectRevert();
        game.win();
        assertFalse(game.isWon());
    }

    function test_win() public {
        Game2 game = new Game2();

        vm.expectRevert();
        game.win();
        assertFalse(game.isWon());

        uint[3] memory switches;
        switches[0]=20;
        switches[1]=47;
        switches[2]=212;

        for( uint i=0; i < switches.length; i++){
            game.switchOn(switches[i]);
        }
        game.win();
        assertTrue(game.isWon());
    }
}
