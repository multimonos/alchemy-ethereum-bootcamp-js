// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Counter} from "./Counter.sol";

contract CounterTest is Test {

    function test_initially_zero() public {
        Counter c = new Counter();
        assertTrue(c.get() == 0);
    }


    function test_increment() public {
        Counter c = new Counter();
        assertTrue(c.get() == 0);

        c.inc();
        assertTrue(c.get() == 1);

        c.inc();
        assertTrue(c.get() == 2);
    }

    function test_decrement_zero_has_effect() public {
        Counter c = new Counter();
        assertTrue(c.get() == 0);

        c.dec();
        assertTrue(c.get() == 0);
    }

    function test_decrement() public {
        Counter c = new Counter();
        assertTrue(c.get() == 0);

        c.inc();
        c.inc();

        c.dec();

        assertTrue(c.get() == 1);
    }
}
