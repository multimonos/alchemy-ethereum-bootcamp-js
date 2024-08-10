import { assert, describe, it } from "vitest";
import { ALCHEMY_APIKEY } from "../config/env.js";

const url = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_APIKEY}`;

describe( `batch json rpc`, () => {

    it( `example`, async () => {

        const request0 = {
            id: 1,
            jsonprc: '2.0',
            method: 'eth_blockNumber'
        }

        const request1 = {
            id: 2,
            jsonprc: '2.0',
            method: 'net_version'
        }

        const res = await fetch( url, {
            method: 'post',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify( [
                request0,
                request1,
            ] )
        } )

        assert.isTrue( res.ok )

        const json = await res.json()

        console.log( { json } )
        assert.lengthOf( json, 2 )
        assert.property( json[0], 'id' )
        assert.property( json[1], 'id' )
        assert.equal( json[0].id, 1 )
        assert.equal( json[1].id, 2 )
    } )

    describe( `total balance`, () => {
        it( `is correct`, async () => {
            const addresses = [
                '0x830389b854770e9102eb957379c6b70da4283d60',
                '0xef0613ab211cfb5eeb5a160b65303d6e927f3f85',
                '0x5311fce951684e46cefd804704a06c5133030dff',
                '0xe01c0bdc8f2a8a6220a4bed665ceeb1d2c716bcb',
                '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
            ]

            const requests = addresses.map( ( address, id ) => ({
                id,
                jsonrpc:'2.0',
                method:'eth_getBalance',
                params:[address]
            }) )

            console.log( {requests} )

            const res = await fetch(url,{
                method:'post',
                headers:{'content-type':'application/json'},
                body:JSON.stringify(requests)
            })

            assert.isTrue(res.ok)

            const json = await res.json()

            console.log({json})

            const total = json.reduce((acc, response)=>{
                const intValue =parseInt(response.result,16)
                console.log( {intValue} ) 
                acc+=intValue
               return acc
            },0)

            console.log({total})
            assert.isAtLeast(total,250000000000000000)

        } )

    } )
} )
