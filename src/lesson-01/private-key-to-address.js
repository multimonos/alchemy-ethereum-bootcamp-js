import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

export const privateKeyToHexAddress = privateKey => {
    // need an uncompressed 65 byte public key
    const uncompressedKey = secp256k1.getPublicKey( privateKey, false )

    // don't need this, but, first byte is the header and will be "0x4" if key is uncompressed
    const header = uncompressedKey.slice( 0, 1 )

    // the public key is 64 bytes
    const publicKey = uncompressedKey.slice( 1 )

    // hash the public key to get a 32 bytes
    const hash = keccak256( publicKey )

    // the address is the last 20 bytes of the hash
    const address = hash.slice( -20 )

    // convert to hex
    const hexAddress = toHex( address )

    return hexAddress
}
