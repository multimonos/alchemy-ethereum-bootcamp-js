import sha256 from "crypto-js/sha256.js"

export const createBlock = (
    {
        data = "",
        previousHash = ""
    } = {} ) => (
    {
        data,
        previousHash,
        toHash() {
            return sha256( this.data + this.previousHash )
        }
    }
)

export const createBlockchain = () => ({

    chain: [],

    addBlock( block ) {
        const previousHash = this.chain.length === 0
            ? ""
            : this.chain[this.chain.length - 1].toHash()
        const nblock = createBlock( {
            ...block,
            previousHash
        } )
        this.chain.push( nblock )
    },

    isValid() {

        let valid = true

        // start checking for chain.length >= 2
        let i = 1

        while ( valid && i < this.chain.length ) {
            valid = valid && this.chain[i].previousHash.toString() === this.chain[i - 1].toHash().toString()
            i++
        }

        return valid
    }
})
