import { assert, describe, it } from "vitest";

const createUtxo = (
    {
        owner = "",
        amount = "",
    } = {} ) => ({
    type: 'utxo',
    owner,
    amount,
    spent: false,
    spend() {
        this.spent = true
    }
})

const createTransaction = (
    {
        inputs = [],
        outputs = [],
    } = {} ) => ({
    type: 'transaction',
    fee: 0,
    inputs,
    outputs,
    execute() {
        if ( this._hasAnySpentUtxo( this.inputs ) ) {
            throw new Error( "has_spent_utxo" )
        }
        if ( ! this._hasSufficientFunds( this.inputs, this.outputs ) ) {
            throw new Error( "insufficient_inputs" )
        }
        this.inputs = this._markAllSpent( this.inputs )
        this.fee = this._transactionFee( this.inputs, this.outputs )
    },
    _hasAnySpentUtxo( utxos ) {
        const spent = utxos.filter( x => x.spent === true )
        return spent.length > 0
    },
    _hasSufficientFunds( inputs, outputs ) {
        const isum = inputs.reduce( ( sum, utxo ) => {
            sum += utxo.amount
            return sum
        }, 0 )
        const osum = outputs.reduce( ( sum, utxo ) => {
            sum += utxo.amount
            return sum
        }, 0 )
        return isum >= osum
    },
    _markAllSpent( utxos ) {
        return utxos.map( x => {
            x.spend()
            return x
        } )
    },
    _transactionFee( inputs, outputs ) {
        let isum = inputs.reduce( ( sum, utxo ) => {
            sum += utxo.amount
            return sum
        }, 0 )
        const osum = outputs.reduce( ( sum, utxo ) => {
            sum += utxo.amount
            return sum
        }, 0 )

        return isum - osum
    }
})

describe( `utxo factory`, () => {
    it( `can create`, () => {
        const utxo = createUtxo()
        assert.property( utxo, "owner" )
        assert.property( utxo, "amount" )
        assert.property( utxo, "spent" )
        assert.isFunction( utxo.spend )
    } )
    it( `.type is "utxo"`, () => {
        const utxo = createUtxo()
        assert.property( utxo, "type" )
        assert.equal( "utxo", utxo.type )
    } )
    it( `.spent is false`, () => {
        const utxo = createUtxo()
        assert.isFalse( utxo.spent )
    } )
    it( `.owner can be set`, () => {
        const utxo = createUtxo( { owner: "foo" } )
        assert.equal( "foo", utxo.owner )
    } )
    it( `.amount can be set`, () => {
        const utxo = createUtxo( { amount: 5 } )
        assert.equal( 5, utxo.amount )
    } )
    it( `.spend() marks .spent as true`, () => {
        const utxo = createUtxo()
        assert.isFalse( utxo.spent )
        utxo.spend()
        assert.isTrue( utxo.spent )
    } )
} )

describe( `transaction factory`, () => {
    it( `can create`, () => {
        const txn = createTransaction()
        assert.isObject( txn )
    } )
    it( `.type is "transaction"`, () => {
        const txn = createTransaction()
        assert.property( txn, "type" )
        assert.equal( "transaction", txn.type )
    } )
    it( `.inputs`, () => {
        const txn = createTransaction()
        assert.property( txn, "inputs" )
        assert.isArray( txn.inputs )
    } )
    it( `.outputs`, () => {
        const txn = createTransaction()
        assert.property( txn, "outputs" )
        assert.isArray( txn.outputs )
    } )
    it( `.fee`, () => {
        const txn = createTransaction()
        assert.property( txn, 'fee' )
        assert.equal( 0, txn.fee )

    } )
    it( `.execute()`, () => {
        const txn = createTransaction()
        assert.isFunction( txn.execute )
    } )
    it( `cannot execute spent utxo`, () => {
        const utxo = createUtxo()
        utxo.spend()
        const txn = createTransaction( { inputs: [ utxo ] } )
        assert.throws( () => txn.execute(), "has_spent_utxo" )
    } )
    describe( `inputs and outputs`, () => {

        it( `throws if outputs > inputs`, () => {
            const inputs = [
                createUtxo( { amount: 2 } ),
            ]
            const outputs = [
                createUtxo( { amount: 5 } ),
                createUtxo( { amount: 3 } ),
                createUtxo( { amount: 2 } ),
            ]
            const txn = createTransaction( { inputs, outputs } )
            assert.throws( () => txn.execute(), "insufficient_inputs" )
        } )
        it( `allows outputs < inputs`, () => {
            const inputs = [
                createUtxo( { amount: 5 } ),
                createUtxo( { amount: 3 } ),
                createUtxo( { amount: 2 } ),
            ]
            const outputs = [
                createUtxo( { amount: 2 } ),
            ]
            const txn = createTransaction( { inputs, outputs } )
            assert.doesNotThrow( () => txn.execute(), "insufficient_inputs" )
        } )
        it( `allows outputs == inputs`, () => {
            const inputs = [
                createUtxo( { amount: 5 } ),
                createUtxo( { amount: 3 } ),
                createUtxo( { amount: 2 } ),
            ]
            const outputs = [
                createUtxo( { amount: 2 } ),
                createUtxo( { amount: 2 } ),
                createUtxo( { amount: 2 } ),
                createUtxo( { amount: 2 } ),
                createUtxo( { amount: 2 } ),
            ]
            const txn = createTransaction( { inputs, outputs } )
            assert.doesNotThrow( () => txn.execute(), "insufficient_inputs" )
        } )
    } )
    describe( `miner fees`, () => {
        it( `miner gets the balance via the .fee propr`, () => {
            const inputs = [
                createUtxo( { amount: 5 } ),
                createUtxo( { amount: 3 } ),
                createUtxo( { amount: 2 } ),
            ]
            const outputs = [
                createUtxo( { amount: 2 } ),
                createUtxo( { amount: 2 } ),
                createUtxo( { amount: 2 } ),
                createUtxo( { amount: 2 } ),
            ]
            const txn = createTransaction( { inputs, outputs } )
            txn.execute()
            assert.equal( 2, txn.fee )
        } )

    } )
} )