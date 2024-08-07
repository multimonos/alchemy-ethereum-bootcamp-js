import { assert, beforeAll, describe, it } from "vitest";
import { Alchemy, Network, Utils, Wallet } from "alchemy-sdk";
import 'dotenv/config'

const dbg = true

describe( `alchemy sdk tests ( sepolia )`, () => {

    describe( `env vars are set`, () => {
        it.each( [
            [ 'ALCHEMY_ETHBOOTCAMP_APIKEY' ],
            [ 'METAMASK_DEV0_PKEY' ],
            [ 'METAMASK_DEV0_ADDRESS' ],
            [ 'METAMASK_DEV1_ADDRESS' ],

        ] )( `process.env.%s`, ( varname ) => {
            assert.property( process.env, varname )
            assert.isNotEmpty( process.env[varname] )
        } )
    } )

    describe( `sdk`, () => {

        let alchemy

        const settings = {
            apiKey: process.env.ALCHEMY_ETHBOOTCAMP_APIKEY,
            network: Network.ETH_SEPOLIA
        }

        beforeAll( () => {
            alchemy = new Alchemy( settings )
            dbg && console.log( { alchemy } )
        } )

        it( `network exists`, async () => {
            assert.property( Network, 'ETH_SEPOLIA' )
        } )

        it( `create new Alchemy`, async () => {
            assert.instanceOf( alchemy, Alchemy )
        } )
    } )

    describe( `wallet`, () => {
        let wallet

        beforeAll( () => {
            wallet = new Wallet( process.env.METAMASK_DEV0_PKEY )
            dbg && console.log( { wallet } )
        } )

        it( `create new Wallet`, async () => {
            assert.instanceOf( wallet, Wallet )
            assert.property( wallet, 'address' )
            assert.isNotEmpty( wallet.address )
            assert.equal( wallet.address, process.env.METAMASK_DEV0_ADDRESS )
        } )

    } )

    describe( `sign a transaction`, () => {
        let alchemy
        let wallet
        let nonce
        let txn
        let signedTxn
        let response
        let chainId = 11155111
        let originalBalance
        let finalBalance
        const settings = {
            apiKey: process.env.ALCHEMY_ETHBOOTCAMP_APIKEY,
            network: Network.ETH_SEPOLIA
        }

        beforeAll( async () => {
            alchemy = new Alchemy( settings )
            wallet = new Wallet( process.env.METAMASK_DEV0_PKEY )
            originalBalance= await alchemy.core.getBalance(process.env.METAMASK_DEV0_ADDRESS)
            nonce = await alchemy.core.getTransactionCount( wallet.address, 'latest' )
            txn = {
                to: process.env.METAMASK_DEV0_ADDRESS,
                value: Utils.parseUnits( '5', 'gwei' ),
                gasLimit: '23000',
                maxPriorityFeePerGas: Utils.parseUnits( '5', 'gwei' ),
                maxFeePerGas: Utils.parseUnits( '20', 'gwei' ),
                nonce,
                type: 2,
                chainId,
            }
            signedTxn = await wallet.signTransaction( txn )
            dbg && console.log( { signedTxn } )
            response = await alchemy.core.sendTransaction( signedTxn )
            console.log( { response } )
            finalBalance = await alchemy.core.getBalance(process.env.METAMASK_DEV0_ADDRESS)
        } )

        it( `new Alchemy`, async () => {
            assert.instanceOf( alchemy, Alchemy )
        } )
        it( `new Wallet`, async () => {
            assert.instanceOf( wallet, Wallet )
        } )
        it( `wallet.address set`, async () => {
            assert.isNotEmpty( wallet.address )
        } )
        it( `nonce is number`, async () => {
            assert.isNumber( nonce )
            assert.isAbove( nonce, 0 )
        } )
        describe( `txn`, () => {
            it.each( [
                [ 'to' ],
                [ 'value' ],
                [ 'gasLimit' ],
                [ 'maxPriorityFeePerGas' ],
                [ 'maxFeePerGas' ],
                [ 'nonce' ],
                [ 'type' ],
                [ 'chainId' ],
            ] )( '.%s', ( prop ) => {
                assert.property( txn, prop )
                assert.isTrue( txn[prop] !== "" )
            } )
        } )
        it( `signed txn is set`, async () => {
            assert.isTrue( signedTxn.startsWith( '0x' ) )
            assert.isString( signedTxn )
        } )
        describe( `response`, () => {
            it.each( [
                [ 'to' ],
                [ 'value' ],
                [ 'gasLimit' ],
                [ 'gasPrice' ],
                [ 'maxPriorityFeePerGas' ],
                [ 'maxFeePerGas' ],
                [ 'nonce' ],
                [ 'type' ],
                [ 'chainId' ],
                [ 'accessList' ],
                [ 'hash' ],
                [ 'v' ],
                [ 'r' ],
                [ 's' ],
                [ 'from' ],
                [ 'confirmations' ],
            ] )( '.%s', ( prop ) => {
                assert.property( response, prop )
            } )
        } )

        it( `final balance != original balance`, async () => {
            assert.notEqual(originalBalance._hex,finalBalance._hex)
            dbg&&console.log(finalBalance,originalBalance  )
        } )
    } )
} )