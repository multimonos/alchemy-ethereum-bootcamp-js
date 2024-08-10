import { assert, beforeAll, describe, it } from "vitest";
import { ethers, Wallet, ZeroHash } from "ethers";
import { GANACHE_URL } from "../config/env.js";
import { Network } from "alchemy-sdk";


const pkey = '0xa3e2b891383bce0cffb603f3eb48fef682a10a6a4d67538f7e5604f38762a006'
const sender = '0x4968352394C17fd7B4Dee84CC51FF341fdDDc007'
const recipients = [
    '0x3759B4Aeb39a8040CBD48f0D05DFaD912C068278',
    '0x43AA15AE6117ebC6ACA4ddcc12B4947E7D88e208',
    '0x4968352394C17fd7B4Dee84CC51FF341fdDDc007',
    '0x5d6a7654d0784f4f25cAb63Ced73095C0E3b7ae7',
    '0x66f7c7BCF133F9bb0cf6Ec1A66f513308912f574',
    '0x6C2cf48e1be3bB128a3916441a8af311D87B5E5a',
    '0xD09386512a54081A00752dB96373596f80d303bB',
    '0xaB1a7E28DCFcC54b65E5b580f34792D32c91EdB9',
    '0xf44308f4a030AfC0410158C02182B7DaB910fAD6',
]
describe.only( `find the ether`, () => {
    let provider
    beforeAll( async () => {
        provider = new ethers.JsonRpcProvider( GANACHE_URL )
    } )

    it( `get first block`, async () => {
        const blk = await provider.getBlock( 0 )
        assert.equal( blk.number, 0 )
        assert.equal( blk.parentHash, ZeroHash )
    } )

    it( `can get latest block`, async () => {
        const blk = await provider.getBlock( 'latest' )
        assert.notEqual( blk.parentHash, ZeroHash )
    } )

    it( `get all blocks`, async () => {
        const latest = await provider.getBlock( 'latest' )

        const promises = []
        for ( let i = 0; i < latest.number; i++ ) {
            promises.push( provider.getBlock( i ) )
        }
        const blocks = await Promise.all( promises )
        // console.log( { blocks } )
        assert.lengthOf( blocks, latest.number )

        // blocks.map( blk => console.log( blk.transactions ) )
    } )

    it( `get all block transactions `, async () => {
        const latest = await provider.getBlock( 'latest' )

        const promises = new Array( latest.number )
            .fill( null )
            .map( ( _, i ) => provider.getBlock( i ) )

        const blocks = await Promise.all( promises )

        const txns = blocks
            .map( b => b.transactions )
            .filter( txns => txns.length )
            .flat( Infinity )
        console.log( { txns } )
        assert.isAbove( txns.length, 0 )
    } )

    it( `can get sender's transactions`, async () => {
        const latest = await provider.getBlock( 'latest' )

        const promises = new Array( latest.number+1 )
            .fill( null )
            .map( ( _, i ) => provider.getBlock( i ) )

        const blocks = await Promise.all( promises )

    const hashes = blocks
            .map( b => b.transactions )
            .filter( txns => txns.length )
            .flat( Infinity )

        const txnPromises = hashes
            .map( hash => provider.getTransaction( hash ) )

        const txns = await Promise.all( txnPromises )
        console.log( { txns } )

        const recipients = new Set( txns
            .filter( t => t.from === sender )
            .filter( t => t.value > 0 )
            .map( t => t.to )
        )


        console.log(  [ ...recipients ]  )
        console.log( recipients.length )

    } )


    it.skip( `can get all txns for user`, async () => {
        const wallet = new Wallet( pkey, provider )
        const latest = provider.getBlock( 0 )


        const blockNumber = await provider.getBlockNumber()
        const count = await provider.getTransactionCount( sender )
        console.log( {
            blockNumber,
            count,
            latest,
        } )
    }, 60000 )

} )