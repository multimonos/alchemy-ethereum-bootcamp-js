import { assert, beforeAll, describe, it } from "vitest";
import "dotenv/config"
import { abi } from "./storage_abi.json"
import { contractAddress } from "./contract_address.js";
import { ethers } from "ethers";

export const hexToInt = hex => parseInt( hex, 16 )
const toDataHexString = str => str.slice( 2 )

describe( `Storage Slots`, () => {

    let provider
    let contract

    beforeAll( async () => {
        provider = new ethers.JsonRpcProvider( process.env.ANVIL_URL )
        contract = new ethers.Contract( contractAddress, abi, provider )
    } )

    describe( `Setup`, () => {
        it( `anvil url is not empty`, async () => {
            assert.isString( process.env.ANVIL_URL )
            assert.isNotEmpty( process.env.ANVIL_URL )
            assert.isTrue( process.env.ANVIL_URL.startsWith( 'http://' ) )
        } )
        it( `abi is valid`, async () => {
            assert.isArray( abi )
        } )
        it( `contract address set`, async () => {
            assert.isString( contractAddress )
            assert.isTrue( contractAddress.startsWith( '0x' ) )
            assert.lengthOf( contractAddress, 42 ) // 0x prefix makes 42
        } )
        it( `provider set`, async () => {
            assert.instanceOf( provider, ethers.JsonRpcProvider )
        } )
        it( `provider is anvil`, async () => {
            const num = await provider.send( "eth_chainId" )
            assert.isTrue( parseInt( num, 16 ) === 31337 )
        } )
        it( `contract set`, async () => {
            assert.instanceOf( contract, ethers.Contract )
        } )
    } )

    describe( `Low level storage access with eth_getStorageAt`, () => {

        const block = 'latest'

        describe( `value type storage`, () => {
            it.each( [
                [ 0, 5 ],
                [ 1, 23 ],
                [ 2, 666 ],
            ] )( `uint256 storage slot %d contains %d`, async ( slotNumber, expected ) => {

                const memhex = ethers.toBeHex( slotNumber, 32 )
                // console.log({memhex})

                const params = [
                    contract.target,
                    memhex,
                    block
                ]
                // console.log({params})

                const val = await provider.send( 'eth_getStorageAt', params )
                assert.equal( hexToInt( val ), expected )
            } )
        } )

        describe( `mapping storage at slot 3`, () => {

            const slotNumber = 0x3

            it( `zero hash`, async () => {
                const exp = '0x290decd9548b62a8d60345a988386fc84ba6bc95484008f6362f93160ef3e563'

                const zero32 = ethers.toBeHex( 0, 32 );
                console.log( { zero32 } )

                const hash = ethers.keccak256( ethers.getBytes( zero32 ) )
                console.log( { hash } )

                assert.equal( hash, exp )
            } )

            it( `concat 2 hex values without "0x" infix`, async () => {
                const a = ethers.toBeHex( 5, 4 )
                const b = ethers.toBeHex( 17, 4 )

                assert.isString( a )
                assert.isString( b )

                // not what we want
                const c = a + b
                assert.equal( c, `0x000000050x00000011` )

                // what we want
                const d = ethers.concat( [ a, b ] )
                assert.equal( d, `0x0000000500000011` )
            } )

            it.each( [
                [ 5, 555 ],
                [ 7, 777 ],
                [ 9, 999 ],
            ] )( `key %d value is %d`, async ( key, expected ) => {

                // locations
                const keyhex = ethers.toBeHex( key, 32 )  // we know this bc of how the contract was coded
                const slothex = ethers.toBeHex( slotNumber, 32 ) // 0x3

                // keccak256
                const memstring = ethers.concat( [ keyhex, slothex ] ) // autostrips infixes
                const memhash = ethers.keccak256( memstring )

                console.log( { keyhex, slothex, memstring,  memhash } )

                // send request
                const params = [
                    contract.target,
                    memhash,
                    block,
                ]

                const val = await provider.send( 'eth_getStorageAt', params )

                assert.equal( hexToInt( val ), expected )
            } )

        } )
    } )

} )