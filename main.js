//
// this will get shredded every lesson
//

import{sha256} from "ethereum-cryptography/sha256";
import {COLORS} from "./src/lesson-01/brute-force-hashing.js";
import { utf8ToBytes } from "ethereum-cryptography/utils";
import{findColor} from "./src/lesson-01/brute-force-hashing.js";
import { tap } from "./src/helper/log.js";

COLORS
    .map( color => findColor( sha256( utf8ToBytes( color ) ) ) )
    .map( tap( 'found' ) )