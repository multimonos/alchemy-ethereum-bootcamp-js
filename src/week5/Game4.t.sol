// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Game4} from "./Game4.sol";

contract Game4Test is Test {

    function test_lose() public {
        Game4 game = new Game4();

        address addr = makeAddr('any');

        vm.expectRevert();
        game.win(addr);

        assertFalse(game.isWon());
    }

    function test_win() public {
        Game4 game = new Game4();

        address self = address(this);

        game.write(self);

        game.win(self);

        assertTrue(game.isWon());
    }

}
