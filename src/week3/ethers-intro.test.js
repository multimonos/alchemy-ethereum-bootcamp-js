import { assert, describe, it } from "vitest";
import { ethers, HDNodeWallet, Wallet } from "ethers";

const dbg = true

describe( `intro to ethers`, () => {

    const pkey = '0xf2f48ee19680706196e2e339e5da3491186e0c4c5030670656b0e0164837257d'

    describe( `wallets`, () => {

        const phrase = 'plate lawn minor crouch bubble evidence palace fringe bamboo laptop dutch ice'

        it( `create with private key -> Wallet`, async () => {
            const wallet = new Wallet( pkey )
            dbg && console.log( { wallet } )
            assert.instanceOf( wallet, Wallet )
        } )
        it( `create with phrase -> HDNodeWallet`, async () => {
            const wallet = Wallet.fromPhrase( phrase )
            dbg && console.log( { wallet } )
            assert.instanceOf( wallet, HDNodeWallet )
        } )
    } )

    describe( `formatting 1 ether`, () => {
        it( `formatEther( 1 ) -> 0.000000000000000001`, () => {
            assert.equal( ethers.formatEther( 1 ), 0.000000000000000001 )
        } )
        it( `formatUnits( '1', 'ether' ) -> 0.000000000000000001`, () => {
            assert.equal( ethers.formatUnits( '1', 'ether' ), 0.000000000000000001 )
        } )
        it( `parseEther( '1' ) -> 1000000000000000000n`, () => {
            assert.equal( ethers.parseEther( '1' ), 1000000000000000000n )
        } )
        it( `parseUnits( '1', 'ether' ) -> 1000000000000000000n`, () => {
            assert.equal( ethers.parseUnits( '1', 'ether' ), 1000000000000000000n )
        } )
    } )

    describe( `sign a transaction`, () => {
        it( `can sign`, async () => {
            const to = "0xdD0DC6FB59E100ee4fA9900c2088053bBe14DE92"
            const wallet = new Wallet( pkey )
            const txn = {
                to,
                value: ethers.parseEther( '1' ),
                gasLimit: 21000,
            }
            const stxn = await wallet.signTransaction( txn )
            dbg && console.log( { txn, stxn } )
            assert.isTrue( stxn.startsWith( '0x' ) )
        } )
    } )

    describe( `ganache connection`, () => {
        it( `can connect`, async () => {
            const provider = new ethers.JsonRpcProvider( `http://localhost:7545` )
            const to = `0x2DACB56DaFf3D41401268150AaFB66A12D9A3808`

            console.log( { provider } )
        } )

    } )
} )