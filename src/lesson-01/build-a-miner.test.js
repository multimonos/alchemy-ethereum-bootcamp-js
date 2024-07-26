// import { sha256 } from "ethereum-cryptography/sha256.js"
import sha256 from "crypto-js/sha256.js"
import { assert, describe, it } from "vitest"
import {createMiner} from "./lib/miner.js";

const dbg = false

describe( `Build a miner`, () => {

    describe( `Assumptions`, () => {

        it( `Array.pop() is destructive`, () => {
            const x = [ 1, 2, 3, 4, 5, 6 ]
            assert( x.length === 6 )

            const y = x.pop()
            assert( y === 6 )
            assert( x.length === 5 )

            dbg && console.log( { x, y } )
        } )
        it( `given empty array, Array.pop() -> undefined`, () => {
            const x = [].pop()
            assert( x === undefined )
        } )
        it( `take until depleted from array`, () => {
            const src = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
            const len = src.length
            const dst = []

            while ( src.length ) {
                const x = src.pop()
                dst.push( x )
            }

            assert( src.length === 0 )
            assert( dst.length === len )
        } )
        it( `take at most 5 from array`, () => {
            const src = [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
            const len = src.length
            const max = 5
            const dst = []

            let i = 0
            while ( src.length && i < max ) {
                const x = src.pop()
                dst.push( x )
                i++
            }

            assert( src.length === len - max )
            assert( dst.length === max )
        } )
    } )

    describe( `Bigints`, () => {
        it( `typeof`, () => {
            assert( typeof 1n === "bigint" )
            assert( typeof BigInt( 1 ) === "bigint" )
            assert( typeof BigInt( "1" ) === "bigint" )
        } )
        it( `equality`, () => {
            assert( 1n < 2n )
            assert( 2n > 1n )
            assert( 3n === 3n )
            assert( 3n == 3n )
            assert( 1n >= 1n )
            assert( 2n >= 1n )
            assert( 1n <= 1n )
            assert( 1n <= 2n )
            assert( 1n !== 2n )
            assert( 1n !== 1 )
            assert( 1n !== "1" )
            assert( 1n != 2n )
            assert.isFalse( 1n != 1 )
            assert.isFalse( 1n != "1" )
        } )

    } )

    describe( `createMiner`, () => {
        it( `initial state`, () => {
            const miner = createMiner();
            assert( miner.mempool.length === 0 )
            assert( miner.blocks.length === 0 )
        } )
        it( `can add 1 txn`, () => {
            const miner = createMiner()
            miner.addTransaction( { sender: "bar" } )
            assert( miner.mempool.length === 1 )
            assert( miner.blocks.length === 0 )
        } )
        it( `can add many txns`, () => {
            const miner = createMiner()
            miner.addTransaction( { sender: "bar" } )
            miner.addTransaction( { sender: "bar" } )
            miner.addTransaction( { sender: "bar" } )
            assert( miner.mempool.length === 3 )
            assert( miner.blocks.length === 0 )
        } )
        it( `mines 1 block`, () => {
            const miner = createMiner()
            const txns = new Array( 1 ).fill( { sender: "bar" } )
            txns.map( txn => miner.addTransaction( txn ) )
            assert( miner.mempool.length === txns.length )
            miner.mine()
            assert( miner.blocks.length === 1 )
        } )
        it( `mined blocks have data props`, () => {
            const miner = createMiner()
            const txns = new Array( 1 ).fill( { sender: "bar" } )
            txns.map( txn => miner.addTransaction( txn ) )
            assert( miner.mempool.length === txns.length )
            miner.mine()
            assert( miner.blocks.length === 1 )
            assert( miner.blocks[0].hasOwnProperty( "nonce" ) )
            assert( miner.blocks[0].hasOwnProperty( "hash" ) )
        } )
        it( `takes at most MAX_TRANSACTIONS from mempool`, () => {
            const miner = createMiner()
            const txns = new Array( 15 ).fill( { sender: "bar" } )
            txns.map( txn => miner.addTransaction( txn ) )
            assert( miner.mempool.length === txns.length )
            miner.mine()
            assert( miner.mempool.length === txns.length - miner.MAX_TRANSACTIONS )
            assert( miner.blocks.length === 1 )
        } )
    } )
} )