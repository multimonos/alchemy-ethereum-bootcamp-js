import { assert, describe, it } from "vitest";
// import fetch from 'node-fetch'

const ethUrl = 'https://eth.llamarpc.com'
// const ethUrl = 'https://eth-mainnet.alchemyapi.io/v2/alcht_PPRvEMgIV6vp2THGhqJpsUitZhRdcn


const createRequest = ( { id = 1, method = '', params = [] } = {} ) => ({
    method: 'post',
    headers: {
        'content-type': 'application/json'
    },
    body: JSON.stringify( {
        jsonrpc: '2.0',
        id,
        method,
        params,
    } )
})

describe( `json rpc block calls`, () => {

    it( `eth_blockNumber`, async () => {
        const request = {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify( {
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_blockNumber',
                params: []
            } ),
        }

        // request
        assert.property( request, 'method' )
        assert.property( request.headers, 'content-type' )
        assert.equal( request.method, 'post' )
        assert.equal( request.headers['content-type'], 'application/json' )

        // response
        const res = await fetch( ethUrl, request )
        assert.isTrue( res.ok )
        const data = await res.json()

        // response schema
        assert.property( data, 'jsonrpc' )
        assert.property( data, 'id' )
        assert.property( data, 'result' )
        assert.equal( data.jsonrpc, '2.0' )

        // response data
        assert.equal( data.id, 1 )
        assert.isString( data.result )
        assert.isNotEmpty( data.result )
    } )


    it( `eth_getBlockByNumber`, async () => {
        const res = await fetch( ethUrl, createRequest( {
            method: 'eth_getBlockByNumber',
            params: [ '0xb443', true ]
        } ) )
        const data = await res.json()

        const resProps = [ 'jsonrpc', 'id', 'result' ]
        resProps.forEach( prop => assert.property( data, prop ) )
        const props = [
            'difficulty',
            'extraData',
            'gasLimit',
            'gasUsed',
            'hash',
            'logsBloom',
            'miner',
            'mixHash',
            'nonce',
            'number',
            'parentHash',
            'receiptsRoot',
            'sha3Uncles',
            'size',
            'stateRoot',
            'timestamp',
            'totalDifficulty',
            'transactions',
            'transactionsRoot',
            'uncles',
        ]

        props.forEach( prop => {
            assert.property( data.result, prop )
        } )
        // console.log( { data } )
    } )
} )