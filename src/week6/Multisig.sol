// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Multisig {

    // --- errors ---
    error OwnersRequired();
    error OnlyOwner();
    error OnlyConfirmed();
    error SignatureThresholdMustBeNonZero();
    error SignatureThresholdTooLarge();

    // --- types ---
    struct Transaction {
        address recipient;
        uint value;
        bool executed;
    }

    // --- state ---
    Transaction[] public transactions;
//    mapping(uint id => Transaction tx) public transactions;
    address[] public owners;
    uint public required;
    mapping(uint => mapping(address => bool)) public confirmations; // txid => owner => hasConfirmed
    // --- events ---
    // --- modifiers ---
    modifier onlyOwner() {
        if (!isOwner(msg.sender)) revert OnlyOwner();
        _;
    }

    // --- fns ---
    constructor(address[] memory accounts, uint signatureThreshold) {
        if (accounts.length == 0) revert OwnersRequired();
        if (signatureThreshold == 0) revert SignatureThresholdMustBeNonZero();
        if (signatureThreshold > accounts.length) revert SignatureThresholdTooLarge();

        owners = accounts;
        required = signatureThreshold;
    }
    receive() external payable {}

    function transactionCount() public view returns (uint)  {
        return transactions.length;
    }

    function addTransaction(address recipient, uint value) public onlyOwner returns (uint) {

        uint txid = transactions.length;

        Transaction memory txn = Transaction({
            recipient: recipient,
            value: value,
            executed: false
        });
        transactions.push(txn);

        return txid;
    }

    function confirmedBy(address owner, uint txid) public view returns (bool) {
        return confirmations[txid] [owner];
    }

    function confirmTransaction(uint txid) public onlyOwner {
        confirmations[txid][msg.sender] = true;

        if(isConfirmed(txid)){
            executeTransaction(txid);
        }
    }

    function isOwner(address addr) private view returns (bool)  {
        bool found;
        uint i;
        while (i < owners.length && !found) {
            if (owners[i] == addr) {
                found = true;
            }

            i++;
        }
        return found;
    }

    function getConfirmationsCount(uint txid) public view returns (uint) {
        uint cnt;
        for (uint i = 0; i < owners.length; i++) {
            if (confirmedBy(owners[i], txid)) {
                cnt++;
            }
        }
        return cnt;
    }

    function submitTransaction(address recipient, uint value) public onlyOwner returns (uint){
        uint txid = addTransaction(recipient, value);
        confirmTransaction(txid);
        return txid;
    }

    function isConfirmed(uint txid) public view returns (bool)  {
        return getConfirmationsCount(txid) >= required;
    }

    function executeTransaction(uint txid) public {
        if (!isConfirmed(txid)) revert OnlyConfirmed();
        // @todo guard not executed

        Transaction memory txn = transactions[txid];

        if(txn.executed) return;

        (bool ok,) = txn.recipient.call{value: txn.value}("");
        require(ok);

        transactions[txid].executed = true;

    }
}
