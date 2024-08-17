import { assert, beforeAll, describe, it } from "vitest"
import "dotenv/config"
import { Alchemy, Network } from "alchemy-sdk";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

const contractAddress = '0x6b175474e89094c44da98b954eedeac495271d0f'
const blockRange = {
    start: '0xff26e1',
    end: '0xff2eb0',
}
const total = 228084566470652280000000000n
const account = '0x28c6c06298d514db089934071355e5743bf21d60'

const TopicIndex = {
    EventSignature: 0,
    FromAddress: 1,
}

const topicFromMethodSignature = sig =>
    '0x' + toHex( keccak256( utf8ToBytes( sig ) ) )

const topicValueFromAddress = address =>
    '0x' + address.replace( /^0x/, '' ).padStart( 64, '0' )

describe( `DAI Transferred`, () => {

    describe( `Pre-conditions`, () => {
        it( `Alchemy api key is set`, async () => {
            assert.isNotEmpty( process.env.ALCHEMY_ETHBOOTCAMP_APIKEY )
        } )

        it( `Alchemy eth mainnet available`, async () => {
            assert.isNotEmpty( Network.ETH_MAINNET )
        } )

        it( `Contract address is set`, async () => {
            assert.isNotEmpty( contractAddress )
        } )

        it( `block range is defined`, async () => {
            assert.property( blockRange, 'start' )
            assert.property( blockRange, 'end' )
            assert.isNotEmpty( blockRange.start )
            assert.isNotEmpty( blockRange.end )
        } )
    } )

    describe( `eth_getLogs response`, () => {

        let logs


        beforeAll( async () => {
            const alchemy = new Alchemy( {
                apiKey: process.env.ALCHEMY_ETHBOOTCAMP_APIKEY,
                network: Network.ETH_MAINNET,
            } )
            logs = await alchemy.core.getLogs( {
                address: contractAddress,
                fromBlock: blockRange.start,
                toBlock: blockRange.end,
            } )

            // console.log( 'logs:', logs, logs.length )
            // console.log( JSON.stringify( logs, null, 4 ) )
            // console.log( topicFromMethodSignature( "Transfer(address,address,uint256)" ) )
            // console.log( topicValueFromAddress( account ) )
        } )

        it( `returns list`, async () => {
            assert.isArray( logs )
            assert.isAbove( logs.length, 0 )
        } )

        describe( `response items`, () => {
            it( `.address is contract address`, async () => {
                logs.forEach( entry => {
                    assert.property( entry, 'address' )
                    assert.equal( entry.address.toLowerCase(), contractAddress.toLowerCase() )
                } )
            } )
            it( `.topics is non-empty array`, async () => {
                logs.forEach( entry => {
                    assert.property( entry, 'topics' )
                    assert.isArray( entry.topics )
                    assert.isBelow( entry.topics.length, 4 )
                } )
            } )
            it( `.data is not empty hex string`, async () => {
                logs.forEach( entry => {
                    assert.property( entry, 'data' )
                    assert.isString( entry.data )
                    assert.isNotEmpty( entry.data )
                    assert.isTrue( entry.data.startsWith( '0x' ) )
                } )

            } )
        } )

        describe( `response wrangling`, () => {

            it( `match the event from entries[].topics[0]`, async () => {

                const eventSearch = topicFromMethodSignature( "Transfer(address,address,uint256)" )
                console.log( { eventSearch } )

                const found = logs.filter( entry =>
                    entry.topics.length
                    && entry.topics[TopicIndex.EventSignature] === eventSearch
                )

                assert.isAbove( found.length, 0 )
                assert.equal( found.length, 1929 )
                console.log( 'found:', found, found.length )
            } )

            it( `match the from address from entries[].topics[1]`, async () => {

                const eventSearch = topicFromMethodSignature( "Transfer(address,address,uint256)" )
                const fromAddressSearch = topicValueFromAddress( account )
                console.log( { eventSearch, fromAddressSearch } )

                const found = logs.filter( entry =>
                    entry.topics.length > 2
                    && entry.topics[TopicIndex.EventSignature] === eventSearch
                    && entry.topics[TopicIndex.FromAddress] === fromAddressSearch
                )

                assert.isAbove( found.length, 0 )
                assert.equal( found.length, 9 )
                console.log( 'found:', found, found.length )
            } )
        } )

        describe( `sum the data for found entries`, () => {

            const exp = 40002218271580000000000n

            it( `sum is ${exp}`, async () => {
                const eventSearch = topicFromMethodSignature( "Transfer(address,address,uint256)" )
                const fromAddressSearch = topicValueFromAddress( account )
                console.log( { eventSearch, fromAddressSearch } )

                const sum = logs
                    .filter( entry =>
                        entry.topics.length > 2
                        && entry.topics[TopicIndex.EventSignature] === eventSearch
                        && entry.topics[TopicIndex.FromAddress] === fromAddressSearch
                    )
                    .map( entry => entry.data )
                    .map( BigInt )
                    .reduce( ( acc, val ) => acc += val, 0n )


                assert.equal( sum, exp )
            } )
        } )
    } )

} )