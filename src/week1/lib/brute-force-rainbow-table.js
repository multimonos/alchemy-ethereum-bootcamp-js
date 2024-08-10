import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { tap } from "../../helper/log.js";
import { sha256 } from "ethereum-cryptography/sha256";

export const COLORS = [ 'red', 'green', 'blue', 'yellow', 'pink', 'orange' ];

const rainbowTable = COLORS
    .map( utf8ToBytes )
    // .map( tap( "utf8tobytes" ) )
    .map( sha256 )
    // .map( tap( "sha256" ) )
    .map( toHex )
    // .map( tap( "toHex" ) )


export function bruteForceRainbowTable( hash ) {

    const needle = toHex( hash )

    const index = rainbowTable
        .findIndex( x => needle === x )

    return COLORS[index]
}

