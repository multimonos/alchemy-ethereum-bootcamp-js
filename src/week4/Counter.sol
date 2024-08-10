// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;


contract Counter {

    uint private _val;


    function get() public view returns (uint){
        return _val;
    }

    function inc() public {
        _val += 1;
    }

    function dec() public {
        if (_val > 1) {
            _val -= 1;
        }
    }
}