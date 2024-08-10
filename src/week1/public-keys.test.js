import { assert, describe, test } from "vitest";
import { secp256k1 } from "ethereum-cryptography/secp256k1";

const PRIVATE_KEY = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";

describe( `public keys with secp256k1`, () => {

    const allowedHeaderBytes = [ 2, 3, 4 ]

    test( `private key -> compressed public key`, () => {

        const publicKey = secp256k1.getPublicKey( PRIVATE_KEY )
        const [ headerByte, ...compressedKey ] = publicKey

        assert( publicKey.length === 33 )
        assert( compressedKey.length === 32 )
        assert( allowedHeaderBytes.includes( headerByte ) )
        assert( headerByte === 3 )
    } )

    test( `private key -> un-compressed public key`, () => {
        // key
        const isCompressed = false;
        const publicKey = secp256k1.getPublicKey( PRIVATE_KEY, isCompressed )
        const [ headerByte, ...uncompressedKey ] = publicKey

        assert( publicKey.length === 65 )
        assert( uncompressedKey.length === 64 )
        assert( allowedHeaderBytes.includes( headerByte ) )
        assert( headerByte === 4 )
    } )

    test( `destructuring assignment does not preserve uint8Array`, () => {
        const uint8 = new Uint8Array( [ 1, 2, 3, 4 ] )
        assert( uint8 instanceof Uint8Array )
        assert.isNotTrue( Array.isArray( uint8 ) )

        const [ head, ...tail ] = uint8

        assert.isNotTrue( Array.isArray( head ) )
        assert.isNotTrue( head instanceof Uint8Array )
        assert( typeof (head) === "number" )

        assert( Array.isArray( tail ) )
        assert.isNotTrue( tail instanceof Uint8Array )

    } )
} )