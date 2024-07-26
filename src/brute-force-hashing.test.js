import { sha256 } from "ethereum-cryptography/sha256";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { COLORS, findColor } from "./brute-force-hashing.js";
import { assert, describe, test } from 'vitest'

const colorHashes = COLORS.map( color => ({
    hash:sha256( utf8ToBytes( color ) ),
    color
}) )

// console.log( { colorHashes } )

describe( `brute force hasing`, () => {

    test( `COLORS has length`, () => {
        assert( COLORS.length > 0 )
    } )

    test.each( [ ...colorHashes ] )( `found $color`, (  {hash, color} ) => {
        assert( findColor( hash ) === color )
    } )
} )
