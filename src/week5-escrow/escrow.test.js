import { assert, beforeAll, describe, it } from "vitest";
import manifest from "./Escrow.json";
import { ethers } from "ethers";
import { ANVIL_URL } from "../config/env.js";
import { anvilAccounts } from "../config/anvilAccounts.js";

describe( `Escrow`, () => {

    describe( `manifest json`, () => {

        it.each( [
            [ 'id' ],
            [ 'abi' ],
            [ 'bytecode' ],
            [ 'deployedBytecode' ],
            [ 'methodIdentifiers' ],
            [ 'metadata' ],
            [ 'rawMetadata' ],
        ] )( `.%s`, async ( prop ) => {
            assert.property( manifest, prop )
        } )

    } )


    describe( `deploy with ethers`, () => {
        let provider
        let signer
        let arbiter
        let beneficiary

        beforeAll( async () => {
            provider = new ethers.JsonRpcProvider( ANVIL_URL )
            signer = new ethers.Wallet( anvilAccounts[0].privateKey, provider )
            arbiter = new ethers.Wallet( anvilAccounts[1].privateKey, provider )
            beneficiary = new ethers.Wallet( anvilAccounts[2].privateKey, provider )
        } )
        it( `signer`, async () => {
            assert.equal( signer.address, `0x${anvilAccounts[0].account}` )
        } )
        it( `arbiter`, async () => {
            assert.equal( arbiter.address, `0x${anvilAccounts[1].account}` )
        } )
        it( `beneficiary`, async () => {
            assert.equal( beneficiary.address, `0x${anvilAccounts[2].account}` )
        } )
        it( `abi`, async () => {
            assert.isArray( manifest.abi )
        } )
        it( `bytecode`, async () => {
            assert.isNotEmpty( manifest.bytecode )
        } )
        describe( `deployment`, () => {
            let contract
            const deposit = ethers.parseEther( '5' )

            beforeAll( async () => {
                const factory = new ethers.ContractFactory(
                    manifest.abi,
                    manifest.bytecode,
                    signer
                )

                contract = await factory.deploy( arbiter, beneficiary, { value: deposit } );

                // wait for the contract to be mined
                const receipt = await contract.waitForDeployment()
                const balance = await provider.getBalance( contract.target )

                console.log( { contract, receipt, balance } )

            } )

            describe( `contract schema`, () => {

                it.each( [
                    [ 'target' ],
                    [ 'interface' ],
                    [ 'runner' ],
                    [ 'filters' ],
                    [ 'fallback' ],
                ] )( `.%s`, async ( prop ) => {
                    assert.property( contract, prop )
                } )
            } )

            it( `deployed to an address`, async () => {
                assert.isString( contract.target )
                assert.isTrue( contract.target.startsWith( '0x' ) )
            } )

            it( `initial deposit of 5 ether was made`, async () => {
                const val = await provider.getBalance( contract.target )
                assert.equal( deposit, val )
            } )

            it( `approval transfers funds to beneficiary`, async () => {
                const initialBalance = await provider.getBalance( beneficiary.address )

                // write
                const tx = await contract.connect( arbiter ).approve()
                await tx.wait()
                //read
                const finalBalance = await provider.getBalance( beneficiary.address )
                const contractBalance = await provider.getBalance( contract.target )
                const approved = await contract.isApproved()


                console.log( {
                    initialBalance,
                    finalBalance,
                    contractBalance,
                    approved
                } )

                assert.equal( initialBalance + deposit, finalBalance, 'beneficiary receives the deposit' )
                assert.equal( 0, contractBalance ,'contract balance is exhausted')
                assert.isTrue( approved, 'contract marked as approved' )

            } )
        } )

    } )

} )