// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract TokenEvents {
    event Transfer(address from, address to, uint value);
    event Approval(address from, address to, uint value);
}


contract Token is TokenEvents {

    // --- errors ---
    error InsufficientFunds();

    // --- types ---
    // --- state ---
    uint public totalSupply;
    uint public decimals = 18;
    string public name = "Foken";
    string public symbol = "FOK";

    mapping(address => uint) private _balances;
    mapping(address => mapping(address => uint)) private _allowed;

    // --- modifiers ---

    // --- fns ---
    constructor() {
        totalSupply = 1000 * (10 ** decimals);
        _balances[msg.sender] = totalSupply;
    }

    function balanceOf(address account) external view returns (uint)  {
        return _balances[account];
    }

    function transfer(address recipient, uint amount) external {
        if (_balances[msg.sender] < amount) revert InsufficientFunds();
        _balances[msg.sender] -= amount;
        _balances[recipient] += amount;

        emit Transfer(msg.sender, recipient, amount);
    }

    function approve(address spender, uint value) public returns (bool){
        _allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(address from, address to, uint value) public returns (bool)  {
        _balances[to] += value;
        _balances[from] -= value;
        _allowed[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}
