// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";

library UIntFunctions {
    function isEven(uint a) internal pure returns (bool)  {
        return a % 2 == 0;
    }

    function isPrime(uint a) public pure returns (bool)  {

        uint n = a - 1;

        while (n > 1) {
            if (a % n == 0) {
                return false;
            }
            n--;
        }
        return true;
    }
}

contract LibrariesTest is Test {

    function test_is_even() public pure {
        assertTrue(UIntFunctions.isEven(2));
        assertFalse(UIntFunctions.isEven(3));
    }

    function test_is_prime() public pure {
        assertTrue(UIntFunctions.isPrime(1));
        assertTrue(UIntFunctions.isPrime(2));
        assertTrue(UIntFunctions.isPrime(3));
        assertTrue(UIntFunctions.isPrime(5));
        assertTrue(UIntFunctions.isPrime(7));
        assertTrue(UIntFunctions.isPrime(11));
    }

    function test_is_not_prime() public pure {
        assertFalse(UIntFunctions.isPrime(4));
        assertFalse(UIntFunctions.isPrime(6));
        assertFalse(UIntFunctions.isPrime(8));
        assertFalse(UIntFunctions.isPrime(9));
        assertFalse(UIntFunctions.isPrime(10));
    }


}
