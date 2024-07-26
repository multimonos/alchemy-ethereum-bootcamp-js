import { sha256 } from "ethereum-cryptography/sha256";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import { COLORS, bruteForceRainbowTable } from "./lib/brute-force-rainbow-table.js";
import { assert, describe, test } from 'vitest'

const colorHashes = COLORS.map( color => ({
    hash:sha256( utf8ToBytes( color ) ),
    color
}) )

// console.log( { colorHashes } )

describe( `brute force hashing - lesson 1`, () => {

    test( `COLORS has length`, () => {
        assert( COLORS.length > 0 )
    } )

    test.each( [ ...colorHashes ] )( `found $color`, (  {hash, color} ) => {
        assert( bruteForceRainbowTable( hash ) === color )
    } )
} )
