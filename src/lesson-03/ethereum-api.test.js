import { assert, beforeAll, describe, it } from "vitest";
import { ALCHEMY_APIKEY } from "../config/env.js";

const url = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_APIKEY}`;

async function getBlockNumber( debug = false ) {
    const res = await fetch( url, {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify( {
            jsonrpc: "2.0",
            id: 1,
            method: 'eth_blockNumber',
            params: []
        } )
    } )

    debug && console.log( { res } )

    if ( ! res.ok ) return false

    const { result } = await res.json()
    return result
}

async function getBalance( address, blockNumber = 'latest', debug = false ) {
    const res = await fetch( url, {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify( {
            jsonrpc: "2.0",
            id: 1,
            method: 'eth_getBalance',
            params: [ address, blockNumber ]
        } )
    } )

    debug && console.log( { res } )

    if ( ! res.ok ) return false

    const json = await res.json()

    debug && console.log( { json } )

    const { result } = json

    return result
}


const validateResponseJson = ( json ) => {
    const props = [
        'jsonrpc',
        'id',
        'result'
    ]
    props.forEach( prop => {
        assert.property( json, prop )
    } )

}
describe( `ethereum json rpc calls`, () => {

    describe( `alchemy api key`, () => {
        it( `is not empty`, () => {
            assert.isNotEmpty( ALCHEMY_APIKEY )
        } )

    } )

    describe( `getCurrentBlockNumber()`, async () => {
        let block
        beforeAll( async () => {
            block = await getBlockNumber()
            console.log( { block } )
        } )
        it( `not empty`, async () => {
            assert.isNotEmpty( block )
        } )
        it( `starts with '0x'`, async () => {
            assert( block.startsWith( '0x' ) )
        } )
    } )

    describe( `getBalance(address)`, () => {
        let bal
        it.each( [
            [ '0x3bfc20f0b9afcace800d73d2191166ff16540258', 0x40db4a285613a0000000 ]
        ] )( `balance for '%s'`, async ( address, lowerBound ) => {
            const bal = await getBalance( address, 'latest', true )
            assert( ! isNaN( bal ) )
            assert.isAbove( parseInt( bal ), lowerBound )

        } )
    } )

    describe( `get user's nonce`, async () => {
        it( `can be got`, async () => {
            const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
            const res = await fetch( url, {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify( {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_getTransactionCount',
                    params: [
                        address
                    ]
                } )
            } )
            const json = await res.json()
            const { result } = json
            console.log( { json } )
            console.log( parseInt( result, 16 ) )
            assert.isAbove( parseInt( result, 16 ), 1200 )
        } )
    } )

    describe( `block txn count`, () => {
        it.each( [
            [ '0x0', 0 ],
            [ '0x' + (16642379).toString( 16 ), 200 ]
        ] )( `for address '%s' is gte %i`, async ( blockNumber, count ) => {
            // const blockNumber = '0x0'
            const res = await fetch( url, {
                method: 'post',
                header: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify( {
                    jsonrpc: '2.0',
                    id: 1,
                    method: 'eth_getBlockTransactionCountByNumber',
                    params: [
                        blockNumber
                    ]
                } )
            } )
            assert.isTrue( res.ok )
            const json = await res.json()
            const { result } = json
            const intResult = parseInt( result, 16 )
            assert.isAtLeast( intResult, count )
        } )
    } )
} )