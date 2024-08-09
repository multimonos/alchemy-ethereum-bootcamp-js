import { assert, describe, it } from "vitest";
import { GANACHE_URL } from "../helper/env.js";
import { ethers, parseEther, TransactionReceipt, TransactionResponse, Wallet } from "ethers";

const dbg = true
// const ganache0_address="0x4968352394C17fd7B4Dee84CC51FF341fdDDc007"
const ganache0_pkey = "0xa3e2b891383bce0cffb603f3eb48fef682a10a6a4d67538f7e5604f38762a006"
const ganache1_address = "0xf44308f4a030AfC0410158C02182B7DaB910fAD6"

describe.skip( `ganache / ethers`, () => {

    it( `can connect`, async () => {
        const provider = new ethers.JsonRpcProvider( GANACHE_URL )
        console.log( { provider } )
    } )

    it( `can xfer ether`, async () => {
        // create provider
        const provider = new ethers.JsonRpcProvider( GANACHE_URL )

        // create wallet with provider
        const wallet = new Wallet( ganache0_pkey, provider )

        // create txn
        const txn = {
            to: ganache1_address,
            value: parseEther( '1' )
        }

        // send
        const response = await wallet.sendTransaction( txn )
        assert.instanceOf( response, TransactionResponse )

        // wait for the block to be mined ( optional P
        const receipt = await response.wait()
        assert.instanceOf( receipt, TransactionReceipt )

        dbg && console.log( { response, receipt } )
    } )

    it( `can send many transactions`, async () => {
        const provider = new ethers.JsonRpcProvider( GANACHE_URL )
        const wallet = new Wallet( ganache0_pkey, provider )
        const txns = new Array( 5 ).fill( {
            to: ganache1_address,
            value: parseEther( '1' )
        } )

        for (const txn of txns){
            const response = await wallet.sendTransaction(txn)
            const receipt = await response.wait()
        }

    } ,40000)
} )