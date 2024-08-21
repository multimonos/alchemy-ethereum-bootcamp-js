// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Proxy, Logic, A, B}from "./Contracts.sol";

contract ProxyTest is Test {

    address public owner;

    Proxy public proxy;
    address public proxyAddr;
    Logic public lproxy;

    A public a;
    address public addrA;

    B public b;
    address public addrB;


    function setUp() external {
        owner = makeAddr('owner');

        a = new A();
        addrA = address(a);

        b = new B();
        addrB = address(b);

        proxy = new Proxy();
        proxyAddr = address(proxy); // address of proxy
        lproxy = Logic(address(proxy)); // proxy address cast with Logic interface


    }

    function test_setX() public {
        proxy.setInstance(addrA);
        lproxy.setX(5);
//        lproxy.getX();
//        assertEq(0, lproxy.getX());
    }

    function test_getX() public {
        proxy.setInstance(addrA);
        lproxy.setX(3);
        assertEq(3, lproxy.getX());
//     this reverts for some reason
    }

//    function test_default_x_is_3() public {
//        proxy.setImplementation(addrB);
//        Logic(proxy).setX(3);
//        assertEq(6, Logic(proxy).getX());
//    }
}
