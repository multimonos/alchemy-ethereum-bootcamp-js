import { assert, describe, test } from "vitest";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

const debug = false
const PRIVATE_KEY = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";
const EXPECTED_ADDRESS = "16bB6031CBF3a12B899aB99D96B64b7bbD719705";


describe( `public key -> ethereum address`, () => {

    test( `from un-compressed public key`, () => {
        // key
        const uncompressedKey = secp256k1.getPublicKey( PRIVATE_KEY, false )
        assert( uncompressedKey.length === 65 )
        debug && console.log( { uncompressedKey, hex: toHex( uncompressedKey ) } )

        // header
        const header = uncompressedKey.slice( 0, 1 )
        assert( header.length === 1 )
        assert( header[0] === 4 )
        assert( header instanceof Uint8Array )
        debug && console.log( { header } )

        // public key decompressed
        const publicKey = uncompressedKey.slice( 1 )
        assert( publicKey.length === 64 )
        assert( publicKey instanceof Uint8Array )
        debug && console.log( { publicKey } )

        // hash
        const hash = keccak256( publicKey )
        assert( hash.length === 32 )
        assert( hash instanceof Uint8Array )
        debug && console.log( { hash } )

        // address
        const address = hash.slice( -20 )
        assert( address.length === 20 )
        assert( hash instanceof Uint8Array )
        debug && console.log( { address } )

        // hex
        const hexAddress = toHex( address )
        assert.equal( hexAddress.toLowerCase(), EXPECTED_ADDRESS.toLowerCase() )
        debug && console.log( { hexAddress, EXPECTED_ADDRESS } )
    } )

    test( `from compressed public key`, () => {

        // @info doing this example bc i tried to get address from compressed public key and failed

        // key
        const compressedKey = secp256k1.getPublicKey( PRIVATE_KEY )
        assert( compressedKey.length === 33 )
        assert( compressedKey instanceof Uint8Array )
        debug && console.log( { compressedKey, hex: toHex( compressedKey ) } )

        // decompress ... somewhat duplicate example really.
        const uncompressedKey = secp256k1
            .ProjectivePoint
            .fromHex( toHex( compressedKey ) )
            .toRawBytes( false )
        assert( uncompressedKey instanceof Uint8Array )
        assert( uncompressedKey.length === 65 )

        // public key
        const publicKey = uncompressedKey.slice( 1 )
        assert( publicKey.length === 64 )
        assert( publicKey instanceof Uint8Array )
        debug && console.log( { publicKey } )

        // hash
        const hash = keccak256( publicKey )
        assert( hash.length === 32 )
        assert( hash instanceof Uint8Array )
        debug && console.log( { hash } )

        // address
        const address = hash.slice( -20 )
        assert( address.length === 20 )
        assert( hash instanceof Uint8Array )
        debug && console.log( { address } )

        // hex
        const hexAddress = toHex( address )
        assert.equal( hexAddress.toLowerCase(), EXPECTED_ADDRESS.toLowerCase() )
        debug && console.log( { hexAddress, EXPECTED_ADDRESS } )
    } )


} )