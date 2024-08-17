import { assert,describe, it } from "vitest"
import "dotenv/config"
import { Alchemy, Network } from "alchemy-sdk";


describe( `Alchemy Transfers API`, () => {

    it.only( `fetch the total ERC20 transfers`, async () => {

        // sdk
        const config = {
            apiKey: process.env.ALCHEMY_ETHBOOTCAMP_APIKEY,
            network: Network.ETH_MAINNET,
        }
        const alchemy = new Alchemy( config )

        // request
        const fromBlock = '0xff26e1'
        const toBlock = '0xff2eb0'
        const res = await alchemy.core.getAssetTransfers( {
            fromBlock,
            toBlock,
            fromAddress: "0x28c6c06298d514db089934071355e5743bf21d60",
            category: [
                'erc20'
            ],
        } )

        // response
        assert.property( res, 'transfers' )
        assert.isArray(res.transfers)
        assert.lengthOf(res.transfers,1000)
        console.log( res, res.transfers.length )


    } )


} )