import { assert, describe, it } from "vitest"
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

describe( `Topics`, () => {

    describe( `Topic 0 - Event signature`, () => {

        it.each( [
            [ 'Transfer(address,address,uint256)', 'ddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' ],
        ] )( `%s signature to %s`, async ( signature, expected ) => {
            // str -> bytes
            const bytes = utf8ToBytes( signature )
            assert.typeOf( bytes, 'uint8array' )

            // bytes -> bytes32
            const hash = keccak256( bytes )
            assert.typeOf( hash, 'uint8array' )
            assert.lengthOf( hash, 32, 'keccak256 returns bytes32' )
            console.log( { hash } )

            // bytes32 -> str
            const hex = toHex( (hash) )
            assert.isString( hex )
            console.log( { hex } )

            // final
            assert.equal( hex, expected )
        } )

    } )

    describe( `prepare address for topic search`, () => {
        it.each( [
            [ '0x28c6c06298d514db089934071355e5743bf21d60', '00000000000000000000000028c6c06298d514db089934071355e5743bf21d60' ],
        ] )( `%s address to %s`, ( address, expected ) => {

            // str -> str : strip 0x prefix
            const str = address.replace( /^0x/g, '' )
            assert.isFalse( str.startsWith( '0x' ), '0x prefix removed' )
            assert.lengthOf( str, 40, '20 bytes is 40 chrs' )
            console.log( { str } )

            // str -> str : left zero pad to 32 bytes
            // str of 32 bytes is 32 pairs of hex, so, 64 chrs
            const padded = str.padStart( 64, '0' )
            assert.lengthOf( padded, 64, '32 bytes is 64 chrs' )
            assert.isTrue( padded.match( /^0{24}/ ) !== null, 'starts with 24 zeros' )
            console.log( { padded } )

            // one liner
            const search = address
                .replace( /^0x/, '' )
                .padStart( 64, 0 )

            assert.isFalse( search.startsWith( '0x' ), '0x prefix removed' )
            assert.lengthOf( search, 64, '32 bytes is 64 chrs' )
            assert.isTrue( search.match( /^0{24}/ ) !== null, 'starts with 24 zeros' )
            assert.equal( search, expected )
        } )

    } )

} )