import { assert, beforeAll, describe, it } from "vitest";
import { ethers } from "ethers";
import { ANVIL0_PKEY, ANVIL_URL } from "../config/env.js";
import { manifest } from "./manifest.js";

const timeout = 60000


describe( `Events game 5`, () => {

    let meta
    let abi

    beforeAll( async () => {
        meta = manifest.find( x => x.id === 'game5' )
        const tmp = await import(meta.abi)
        abi = tmp.abi
    } )


    describe( `setup`, () => {
        it( `manifest is array`, async () => {
            assert.isArray( manifest )
        } )
        it( `manifest length 5`, async () => {
            assert.lengthOf( manifest, 5 )
        } )
        it( `address not empty`, async () => {
            assert.isNotEmpty( meta.address )
            assert.isTrue( meta.address.startsWith( '0x' ) )
        } )
        describe( `abi`, () => {
            it.each( [
                [ 'win' ],
                [ 'mint' ],
                [ 'giveMeAllowance' ],
            ] )( `.%s()`, async ( method ) => {
                const fn = abi.find( x => x.type === 'function' && x.name === method )
                assert.isObject( fn )
            } )
        } )
    } )

    describe( `winning`, () => {

        it( `has been won!`, async () => {
            const provider = new ethers.JsonRpcProvider( ANVIL_URL )
            const wallet = new ethers.Wallet( ANVIL0_PKEY, provider )
            const contract = new ethers.Contract(
                meta.address,
                abi,
                wallet
            )

            const tx0 = await contract.giveMeAllowance( 50000 )
            await tx0.wait()

            const tx1 = await contract.mint( 15000 )
            await tx1.wait()

            const response = await contract.win()
            const receipt = await response.wait()

            assert.property( receipt, 'logs' )
            assert.lengthOf( receipt.logs, 1 )
            assert.equal( receipt.logs[0].fragment.name, 'Winner' )
            assert.equal( receipt.logs[0].args[0], wallet.address )
        }, timeout )

    } )

} )