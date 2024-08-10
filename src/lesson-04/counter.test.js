import { assert, beforeAll, describe, it } from "vitest";
import { ethers } from "ethers";
import { ANVIL0_PKEY, ANVIL_URL } from "../config/env.js";
import { contractAddress } from "./contract-address.js";
import { anvilAccounts } from "../config/anvilAccounts.js";
import { abi } from "./counter-abi.json"

const veryLongTestTimeout = 60 * 1000

describe( `counter test`, () => {

    let provider
    let wallet
    let contract

    beforeAll( () => {
        provider = new ethers.JsonRpcProvider( ANVIL_URL )
        wallet = new ethers.Wallet( ANVIL0_PKEY, provider )
        contract = new ethers.Contract(
            contractAddress,
            abi,
            wallet
        )
        console.log( { abi } )
        // console.log( { abi, wallet, provider } )
    } )

    describe( `setup`, () => {
        it( `provider ok`, async () => {
            assert.instanceOf( provider, ethers.JsonRpcProvider )
        } )
        it( `wallet ok`, async () => {
            assert.instanceOf( wallet, ethers.Wallet )
        } )
        it( `contract address not empty`, async () => {
            assert.isNotEmpty( contractAddress )
            assert.isTrue( contractAddress.startsWith( '0x' ) )
        } )
    } )

    describe( `abi`, () => {
        it( `is array`, async () => {
            assert.isArray( abi )
        } )
        it( `has 3 entries`, async () => {
            assert.lengthOf( abi, 3 )
        } )
        it.each( [
            [ 'get' ],
            [ 'inc' ],
            [ 'dec' ],
        ] )( `%s() is defined`, async ( method ) => {
            const found = abi.find( x => x.name === method )
            assert.isObject( found )
        } )
    } )

    describe( `.get()`, () => {
        it( `returns BigInt`, async () => {
            const val = await contract.get()
            assert.isTrue( typeof val === 'bigint' )
        } )
        it( `initally at least zero`, async () => {
            const val = await contract.get()
            assert.isTrue( val >= 0 )
        } )
    } )

    describe( `.inc()`, () => {
        it.each( [
            [ 1, 1 ],
            [ 2, 2 ],
            // [ 3,3 ],
            // [ 10,10 ],
        ] )( `can increment %sx`, async ( count, delta ) => {
            const initial = await contract.get()
            for ( let i = 0; i < count; i++ ) {
                const tx = await contract.inc()
                await tx.wait()
            }
            const final = await contract.get()
            assert.equal( final - initial, delta )

        }, veryLongTestTimeout )
    } )


    describe( `.dec()`, () => {
        it.each( [
            [ 1, -1 ],
            [ 2, -2 ],
            // [ 3, -3 ],
            // [ 10, -10 ],
        ] )( `can decrement %sx`, async ( count, delta ) => {
            const initial = await contract.get()
            for ( let i = 0; i < count; i++ ) {
                const tx = await contract.dec()
                await tx.wait()
            }
            const final = await contract.get()
            assert.equal( final - initial, delta )

        }, veryLongTestTimeout )

    } )


    describe.only( `connect to many signers / wallets`, () => {
        let wallets
        beforeAll( () => {
            wallets = anvilAccounts.map( acct => {
                return new ethers.Wallet( acct.privateKey, provider )
            } )
        } )
        it( `many wallets created`, async () => {
            wallets.forEach( w => assert.instanceOf( w, ethers.Wallet ) )
        } )
        it( `can use 'connect' to create txns`, async () => {
            const initial = await contract.get()
            for ( let i = 0; i < wallets.length; i++ ) {
                const tx = await contract.connect( wallets[i] ).inc()
                await tx.wait()
            }
            const final = await contract.get()
            assert.equal( final - initial, wallets.length )
        }, veryLongTestTimeout )

    } )
} )