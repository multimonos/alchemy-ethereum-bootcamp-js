// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Token, TokenEvents}from"./Token.sol";
import {Bucket}from "./Bucket.sol";

contract BucketTest is Test, TokenEvents {

    struct Amounts {
        uint eoaStart;
        uint eoaFinal;
        uint approved;
        uint transfer;
    }

    event Winner(address);

    function test_emits_winner() public {
        // eoas
        address eoa = makeAddr('eoa');
        address owner = makeAddr('owner');

        // contracts
        Bucket bucket = new Bucket();

        vm.prank(owner);
        Token tok = new Token();

        // data
        Amounts memory amounts = Amounts({
            eoaStart: 5 ether,
            approved: 2 ether,
            transfer: 1 ether,
            eoaFinal: 4 ether
        });

        // tok -> eoa
        vm.expectEmit();
        emit Transfer(address(owner), address(eoa), amounts.eoaStart);
        vm.prank(owner);
        tok.transfer(eoa, amounts.eoaStart);
        assertEq(tok.balanceOf(eoa), amounts.eoaStart);

        // eoa approves bucket
        vm.prank(eoa);
        vm.expectEmit();
        emit Approval(address(eoa), address(bucket), amounts.approved);
        tok.approve(address(bucket), amounts.approved);
        assertEq(tok.balanceOf(eoa), amounts.eoaStart);
        assertEq(tok.balanceOf(address(bucket)), 0);

        // bucket collects
        vm.prank(eoa);

        vm.expectEmit();
        emit Transfer(address(eoa), address(bucket), amounts.transfer);

        vm.expectEmit();
        emit Winner(address(eoa));

        bucket.drop(address(tok), amounts.transfer);

        assertEq(tok.balanceOf(address(bucket)), amounts.transfer);
        assertEq(tok.balanceOf(eoa), amounts.eoaFinal);
    }

}
