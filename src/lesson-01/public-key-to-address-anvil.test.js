import { assert, describe, test } from "vitest";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { anvil } from "../config/anvil.js";
import { privateKeyToHexAddress } from "./private-key-to-address.js";

const debug = false
const PRIVATE_KEY = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";
const EXPECTED_ADDRESS = "16bB6031CBF3a12B899aB99D96B64b7bbD719705";

// test data
const cases = anvil.privateKeys.map( ( key, i ) => ({
    privateKey: key,
    account: anvil.accounts[i]
}) )
debug && console.log( { cases } )

describe( `anvil public key -> ethereum address`, () => {

    describe( `manual calculation`, () => {

        test.each( [ ...cases ] )( `$privateKey -> $account`, ( { privateKey, account } ) => {

            debug && console.log( '-'.repeat( 50 ) )
            debug && console.log( { privateKey, account } )
            debug && console.log( '-'.repeat( 50 ) )

            // get the uncompressed public key ( 65 bytes )
            const uncompressedKey = secp256k1.getPublicKey( privateKey, false )
            // test
            assert( uncompressedKey.length === 65 )
            debug && console.log( { uncompressedKey, hex: toHex( uncompressedKey ) } )

            // check the header ( first byte )
            const header = uncompressedKey.slice( 0, 1 )
            // test
            assert( header.length === 1 )
            assert( header[0] === 4 )
            assert( header instanceof Uint8Array )
            debug && console.log( { header } )

            // public key data ( last 64 bytes )
            const publicKey = uncompressedKey.slice( 1 )
            // test
            assert( publicKey.length === 64 )
            assert( publicKey instanceof Uint8Array )
            debug && console.log( { publicKey } )

            // hash the public key
            const hash = keccak256( publicKey )
            // test
            assert( hash.length === 32 )
            assert( hash instanceof Uint8Array )
            debug && console.log( { hash } )

            // address is the last 20 bytes of the hashed public key
            const address = hash.slice( -20 )
            // test
            assert( address.length === 20 )
            assert( hash instanceof Uint8Array )
            debug && console.log( { address } )

            // hex
            const hexAddress = toHex( address )
            // test
            assert( hexAddress.toLowerCase() === account.toLowerCase() )
            debug && console.log( { hexAddress, account } )
        } )

    } )

    describe( `privateKeyToHexAddress()`, () => {

        test.each( [ ...cases ] )(
            `$privateKey -> $account`,
            ( { privateKey, account } ) => {
                const address = privateKeyToHexAddress( privateKey )
                assert( address.toLowerCase() === account.toLowerCase() )
            } )
    } )
} )