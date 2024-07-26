
import sha256 from "crypto-js/sha256.js"

const dbg = false
export const createMiner = () => ({
    MAX_TRANSACTIONS: 10,
    // 5 zeros starts to get tough ...
    // DIFFICULTY: BigInt( 0x000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffff ),
    DIFFICULTY: BigInt( 0x00ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff ),
    mempool: [],
    blocks: [],
    addTransaction: function ( x ) {this.mempool.push( x )},
    mine: function () {

        const block = {
            id: this.blocks.length, // as per lesson requirement
            transactions: [],
        }

        // take at most MAX_TRANSACTIONS into block
        let i = 0
        while ( this.mempool.length && i < this.MAX_TRANSACTIONS ) {
            const txn = this.mempool.pop()
            block.transactions.push( txn )
            i++
        }

        // mine
        let done = false
        let nonce = 0
        while ( ! done ) {
            const candidate = { ...block, nonce }
            const hash = sha256( JSON.stringify( candidate ) )

            done = BigInt( `0x${hash}` ) < this.DIFFICULTY

            if ( done ) {
                block.nonce = nonce
                block.hash = hash
            } else {
                nonce++
            }
            dbg && console.log( `${nonce}: 0x${hash}` )
        }

        dbg && console.log({nonce})

        this.blocks.push( block )
    }
})
