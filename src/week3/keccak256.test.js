import { assert, describe, it } from "vitest";
import { keccak256 } from "ethereum-cryptography/keccak";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";

const dbg = false
const strings = [
    'withdrawEther()',
    'helloWorlds(uint256)',
    'foobar(uint256)(bool)',
    'averylongsuperlongfunctioname(uint256,uint8,bool)(bool)',
]
const stringsWithLength = strings.map( s => [ s, s.length ] )
const bytesWithLength = strings.map( s => [ s, s.length, utf8ToBytes( s ) ] )

const fn = 'foobar(uint256)(bool)'//foobar takes a uint256 and returns a bool

describe( `utf8tobytes`, () => {

    describe( `returns variable lengths of uint8array`, () => {
        it.each( stringsWithLength )( `'%s' has length %i`, ( str, len ) => {
            const bytes = utf8ToBytes( str )
            // console.log( str, { bytes } )
            assert.lengthOf( bytes, len )
            assert.instanceOf( bytes, Uint8Array )
        } )
    } )

    describe( `bytes length eq string original length `, () => {
        it.each( bytesWithLength )( `'%s' has length %s`, ( str, len, bytes ) => {
            assert.lengthOf( bytes, len )
            assert.lengthOf( str, len )
            // console.log( {bytes,str} ) 
        } )
    } )

} )

describe( `keccak256`, () => {
    const lengthAndBytes = strings.map( s => [ s.length, utf8ToBytes( s ) ] )

    it.each( lengthAndBytes )( `always returns uint8array[32] ... given length=%i`, ( len, str ) => {
        const hash = keccak256( str )
        assert.instanceOf( hash, Uint8Array )
        assert.lengthOf( hash, 32 )
    } )
    it.each( strings )( `convert to data`, ( str ) => {
        // convert string -> bytes (aka uint8array)
        const bytes = utf8ToBytes( str )

        // hash
        const hash = keccak256( bytes )
        assert.lengthOf( hash, 32 )
        assert.instanceOf( hash, Uint8Array )

        // keep first 4 bytes only
        const first4Bytes = hash.slice( 0, 4 )
        assert.lengthOf( first4Bytes, 4 )
        assert.instanceOf( first4Bytes, Uint8Array )

        // pad to 32 bytes
        const padded = new Uint8Array( 32 )
        padded.set( first4Bytes )
        assert.lengthOf( padded, 32 )
        assert.instanceOf( padded, Uint8Array )

        // convert to hex
        const hexString = toHex( padded )
        assert.lengthOf( hexString, 64 )
        assert.isString( hexString )

        // add 0x prefix
        const withPrefix = `0x${hexString}`
        assert.lengthOf( withPrefix, 66 )
        assert.isString( withPrefix )

        dbg && console.log( 'calldata:', { bytes, hash, first4Bytes, padded, hexString, withPrefix } )
    } )


} )