// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {console} from "forge-std/console.sol";

interface Logic {
    // Cannot use this within Proxy ... we should not force the Proxy to
    // have any shape as it is not something we can upgrade.

    function setX(uint x) external;
    function getX() external returns (uint);

}

contract Proxy {
    uint public _x;

    address private _instance;

    function setInstance(address addr) external {
        _instance = addr;
    }

    fallback() external {

        console.logBytes(msg.data);

        (bool rs,bytes memory data) = _instance.delegatecall(msg.data);

        console.logBytes(data);

        if (rs) {
            this; // use the returned value for nothing.
        }
    }

//
//    function setX(uint x) external {
//        Logic(_implmentation).setX(x);
//    }
//
//    function getX() external returns (uint)  {
//        return Logic(_implmentation).getX();
//    }

}

contract A { // version A of logic
    uint public _x;

    function setX(uint val) external {
        _x = val;
    }

    function getX() external returns (uint)  {
        return _x;
    }
}

contract B { // version B of logic
    uint public _x;

    function setX(uint val) external {
        _x = 2 * val;
    }

//    function getX() external returns (uint)  {
//        return _x;
//    }
}

