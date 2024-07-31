import { assert, beforeAll, describe, it } from "vitest";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { anvil } from "../config/anvil.js";

const debug = false

const msg = "Vote Yes on Proposal 327"
const PRIVATE_KEY = "6b911fd37cdf5c81d4c0adb1ab7fa822ed253ab0ad9aa18d77257c88b29b718e";

describe( `public key cryptography`, () => {

    describe( `hash the message`, () => {

        it( `utf8ToBytes -> bytes[]`, () => {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array
            // 8 bits = 1 byte
            // utf8ToBytes -> Uint8Array -> an array of uint8
            const bytes = utf8ToBytes( msg )

            assert( bytes.length === 24 ) // 24 bytes
            assert( toHex( bytes ) === "566f746520596573206f6e2050726f706f73616c20333237" )
            debug && console.log( { bytes }, toHex( bytes ) )
        } )

        it( `keccak256(Uint8Array) -> bytes[] with length 32`, () => {
            const hash = keccak256( utf8ToBytes( msg ) )

            assert( hash.length === 32 ) // 32 bytes
            assert( toHex( hash ) === "928c3f25193b338b89d5646bebbfa2436c5daa1d189f9c565079dcae379a43be" )
            debug && console.log( { hash }, toHex( hash ) )
        } )

    } )

    describe( `sign the message`, () => {

        it( `secp256k1 -> RecoveredSignatureType`, async () => {
            const hash = keccak256( utf8ToBytes( msg ) )
            const sig = await secp256k1.sign( hash, PRIVATE_KEY )

            // struct
            assert( sig.hasOwnProperty( "r" ) ) //Signature
            assert( sig.hasOwnProperty( "s" ) ) //Signature
            assert( sig.hasOwnProperty( "recovery" ) ) //RecoveredSignatureType
            // types
            assert( typeof (sig.r) === "bigint" )
            assert( typeof (sig.s) === "bigint" )
            assert( sig.recovery === 1 )

            debug && console.log( { sig }, typeof (sig.r) )
        } )
    } )

    describe( `recover the public key`, () => {

        test( `can recover the public key`, async () => {
            const bytes = utf8ToBytes( msg )
            const hash = keccak256( bytes )
            const sig = await secp256k1.sign( hash, PRIVATE_KEY )

            // method one : given hash only
            const pubkey = sig.recoverPublicKey( hash )
            const pubkeyBytes = sig.recoverPublicKey( hash ).toRawBytes()
            const pubkeyHex = toHex( pubkeyBytes )
            debug && console.log( {
                public: pubkey,
                rawbytes: pubkeyBytes,
                hex: pubkeyHex,
                hextype: typeof (toHex( pubkeyBytes ))
            } )

            // method 2 : given private key
            const pubkey2 = secp256k1.getPublicKey( PRIVATE_KEY )
            const pubkey2Hex = toHex( pubkey2 )
            debug && console.log( {
                public2: pubkey2,
                hex: pubkey2Hex,
                hexType: typeof (pubkey2Hex)
            } )

            assert( typeof (pubkeyHex) === "string" )
            assert( typeof (pubkey2Hex) === "string" )
            assert( pubkeyHex == pubkey2Hex )

        } )
    } )


} )