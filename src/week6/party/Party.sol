// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Party {

    // --- errors ---
    error InvalidEntryfee();
    error DuplicateRsvp();

    // --- types ---
    // --- state ---
    uint private _entryfee;
    mapping(address => bool) private _rsvps;
    address[] private _members;

    // --- events ---
    // --- modifiers ---
    // --- fns ---
    constructor(uint entryfee){
        _entryfee = entryfee;
    }

    function rsvp() external payable {
        if (msg.value != _entryfee) revert InvalidEntryfee();
        if (hasRsvp(msg.sender)) revert DuplicateRsvp();

        _members.push(msg.sender);// length restricted by DuplicateRsvp requirement
        _rsvps[msg.sender] = true;
    }

    function hasRsvp(address addr) private view returns (bool){
        return _rsvps[addr];
    }

    function payBill(address venue, uint cost) external {
        // pay cost
        (bool venuePaymentSuccess,) = venue.call{value: cost}('');
        require(venuePaymentSuccess);

        // divide remainder among members
        uint balance = address(this).balance;
        uint payout = balance / _members.length;

        if (balance > 0) {
            for (uint i = 0; i < _members.length; i++) {
                (bool success,) = _members[i].call{value: payout}('');
                require(success);
            }
        }
    }
}
