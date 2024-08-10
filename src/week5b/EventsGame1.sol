//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract EventsGame1 {
    event Winner(address winner);

    function win() public {
        emit Winner(msg.sender);
    }
}