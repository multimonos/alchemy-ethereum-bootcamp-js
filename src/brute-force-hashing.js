import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { tap } from "./helper.js";
import { sha256 } from "ethereum-cryptography/sha256";

export const COLORS = [ 'red', 'green', 'blue', 'yellow', 'pink', 'orange' ];

export function findColor( hash ) {

    const rainbow = COLORS
        .map( utf8ToBytes )
        .map( tap( "utf8tobytes" ) )
        .map( sha256 )
        .map( tap( "sha256" ) )
        .map( toHex )
        .map( tap( "toHex" ) )

    const needle = toHex( hash )

    const index = rainbow.findIndex( x => needle === x )

    return COLORS[index]
}

