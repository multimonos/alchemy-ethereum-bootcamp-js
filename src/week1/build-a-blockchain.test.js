import { assert, beforeEach, describe, it } from "vitest"
import { createBlock, createBlockchain } from "./lib/blockchain.js";


describe( `build a blockchain`, () => {

    describe( `block`, () => {

        let block

        beforeEach( () => {
            block = createBlock( { data: "any" } )
        } )
        it( `.data exists`, () => {
            assert.property( block, "data" )
        } )
        it( `.previousHash exists`, () => {
            assert.property( block, "previousHash" )
        } )
        describe( `.toHash()`, () => {
            it( `exists`, () => {
                assert.isFunction( block.toHash )
            } )
            it( `return value can be converted to string`, () => {
                const rs = block.toHash()
                assert.isFunction( rs.toString )
                assert( typeof (rs.toString()) === "string" )
            } )
        } )
    } )

    describe( `blockchain`, () => {

        let blockchain

        beforeEach( () => {
            blockchain = createBlockchain()
        } )

        it( `.chain exists`, () => {
            assert.property( blockchain, "chain" )
        } )

        describe( `.addBlock( block )`, () => {
            it( `exists`, () => {
                assert.isFunction( blockchain.addBlock )
            } )
            it( `adds block to chain`, () => {
                blockchain.addBlock( createBlock( { data: "any" } ) )
                assert( blockchain.chain.length == 1 )
            } )
            it( `genesis block has empty previousHash`, () => {
                blockchain.addBlock( createBlock( { data: "genesis" } ) )
                assert( blockchain.chain[0].previousHash === "" )
            } )
            it( `sets the block.previousHash value`, () => {
                const genesis = createBlock( { data: "genesis" } )
                blockchain.addBlock( genesis )
                blockchain.addBlock( createBlock( { data: "one" } ) )
                assert( blockchain.chain[0].previousHash === "" )
                assert.equal( blockchain.chain[1].previousHash, genesis.toHash().toString() )
            } )
        } )

        describe( `.isChainValid()`, () => {
            it( `chain of length 0 is always valid`, () => {
                assert.isTrue( blockchain.isValid() )
            } )
            it( `chain of length 1 is always valid`, () => {
                blockchain.addBlock( createBlock( { data: "any" } ) )
                assert.isTrue( blockchain.isValid() )
            } )
            it( `validates chain correctly`, () => {
                blockchain.addBlock( createBlock( { data: "genesis" } ) )
                blockchain.addBlock( createBlock( { data: "one" } ) )
                blockchain.addBlock( createBlock( { data: "two" } ) )
                blockchain.addBlock( createBlock( { data: "three" } ) )
                assert.isTrue( blockchain.isValid() )
            } )
            it( `returns false if chain corrupted`, () => {
                blockchain.addBlock( createBlock( { data: "genesis" } ) )
                blockchain.addBlock( createBlock( { data: "one" } ) )
                blockchain.addBlock( createBlock( { data: "two" } ) )
                blockchain.addBlock( createBlock( { data: "three" } ) )
                blockchain.chain[2].previousHash = "foobar"
                assert.isFalse( blockchain.isValid() )
            } )

        } )
    } )
} )
