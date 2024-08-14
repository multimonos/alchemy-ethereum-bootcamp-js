// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract DeadMansSwitch {

    // --- errors ---
    error OnlyOwner();
    error OnlyRecipient();
    error Locked();
    // --- types ---
    // --- state ---
    uint constant _minDelay = 52 weeks;
    address private _owner;
    address private _recipient;
    uint private  _lastPingAt;
    // --- events ---
    // --- modifiers ---
    modifier onlyOwner{
        if (msg.sender != _owner) revert OnlyOwner();
        _;
    }
    modifier onlyRecipient{
        if (msg.sender != _recipient) revert OnlyRecipient();
        _;
    }

    // --- fns ---
    constructor(address recipient) payable {
        _owner = msg.sender;
        _recipient = recipient;
        _lastPingAt = block.timestamp;
    }

    function ping() external onlyOwner {
        _lastPingAt = block.timestamp;

    }

    function withdraw() external onlyRecipient {
        if (block.timestamp < _lastPingAt + _minDelay) revert Locked();

        (bool ok,) = _recipient.call{value: address(this).balance}('');
        require(ok);
    }


}
