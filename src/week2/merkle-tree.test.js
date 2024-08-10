import { assert, beforeEach, describe, it } from "vitest";

const createMerkleTree = (
    {
        leaves = [],
        hashFn = ( a, b ) => `${a}${b}`,

    } = {} ) => (
    {
        leaves,
        hashFn,
        getRoot() {
            return this._merkleRoot( this.leaves )
        },
        _merkleRoot( list ) {
            if ( list.length === 1 ) return list[0]

            // i thought if we have odd leaves we double the last one ... but alchemy
            // suggests just pushing the hash up?

            const nlist = []

            for ( let i = 0; i < list.length; i += 2 ) {

                const chunk = list.slice( i, i + 2 )

                if ( chunk.length === 2 ) {
                    nlist.push( hashFn( chunk[0], chunk[1] ) )
                } else {
                    nlist.push( chunk[0] )
                }
            }

            return this._merkleRoot( nlist )
        },
        hashTree() {
            return this._makeHashTree( this.leaves )
        },
        _makeHashTree( list, tree = [] ) {
            // at root
            if ( list.length === 1 ) return tree
            // add initial leaves
            if ( tree.length === 0 ) tree.push( list )

            // add hashes
            const nlist = []

            for ( let i = 0; i < list.length; i += 2 ) {

                const chunk = list.slice( i, i + 2 )

                if ( chunk.length === 2 ) {
                    nlist.push( hashFn( chunk[0], chunk[1] ) )
                } else {
                    nlist.push( chunk[0] )
                }
            }

            // prepend
            tree = [ nlist, ...tree ]

            return this._makeHashTree( nlist, tree )
        },

        getProof( idx ) {
            // prove that leaf[idx] is in the merkle tree.
            return this._createProof( idx, this.leaves )
        },
        _createProof( idx, txns ) {

            const tree = this._makeHashTree( txns )
            let lvl = tree.length - 1
            // console.log( { tree } )

            const proof = []

            while ( lvl > 0 ) {

                const isLeft = idx % 2 === 0

                const entry = isLeft
                    ? { data: tree[lvl][idx + 1], left: false }
                    : { data: tree[lvl][idx - 1], left: true }

                // console.log( { lvl, idx, isLeft, entry } )

                if ( entry.data ) {
                    proof.push( entry )
                }

                idx = Math.floor( idx / 2 ) // parent

                lvl-- // next level up
            }

            // console.log( { proof } )
            return proof
        },
        verify( proof, node, root, concat ) {
            let nodes = [
                { data: node },
                ...proof
            ]
            // console.log( { node, proof, nodes } )

            while ( nodes.length > 1 ) {
                const [ a, b ] = nodes.slice( 0, 2 )
                const data = b.left
                    ? concat( b.data, a.data )
                    : concat( a.data, b.data )
                const newNode = { data, left: b.left }
                nodes.splice( 0, 2, newNode )

                // console.log( { a, b,newNode,nodes } )
            }
            // console.log( 'done', { nodes } )

            return root === nodes[0].data
        }

    }
)


describe( `merkle tree`, () => {
    it( `1 leaf`, () => {
        const leaves = [ 'A' ]
        const tree = createMerkleTree( { leaves } )
        assert.equal( 'A', tree.getRoot() )
    } )

    it( `2 leaves`, () => {
        const leaves = [ 'A', 'B' ]
        const tree = createMerkleTree( { leaves } )
        assert.equal( 'AB', tree.getRoot() )
    } )

    it( `3 leaves`, () => {
        // i thought if we have odd leaves we double the last one ... but alchemy
        // suggests just pushing the hash up?
        const leaves = [ 'A', 'B', 'C' ]
        const tree = createMerkleTree( { leaves } )
        assert.equal( 'ABC', tree.getRoot() )
    } )

    it( `4 leaves`, () => {
        const leaves = [ 'A', 'B', 'C', 'D' ]
        const tree = createMerkleTree( { leaves } )
        assert.equal( 'ABCD', tree.getRoot() )
    } )

    it( `8 leaves`, () => {
        const leaves = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ]
        const tree = createMerkleTree( { leaves } )
        assert.equal( 'ABCDEFGH', tree.getRoot() )
    } )

    describe( `merkel proof`, () => {
        it( `true|0`, () => {
            const foo = true | 0
            const bam = false | 1
            assert.equal( foo, 1 )
            assert.equal( bam, 1 )
        } )
        it( `case 1`, () => {
            const exp = [
                { data: 'D', left: false },
                { data: 'AB', left: true },
                { data: 'E', left: false }
            ]
            const leaves = [ 'A', 'B', 'C', 'D', 'E' ]
            const tree = createMerkleTree( { leaves } )
            assert.equal( leaves.join( '' ), tree.getRoot() )
            assert.deepEqual( exp, tree.getProof( 2 ) )

        } )
        describe( `A->I cases`, () => {
            const leaves = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ]
            let tree
            beforeEach( () => {
                tree = createMerkleTree( { leaves } )
                assert.equal( leaves.join( '' ), tree.getRoot() )
            } )
            it( `A`, () => {
                const exp = [
                    { data: 'B', left: false },
                    { data: 'CD', left: false },
                    { data: 'EFGH', left: false },
                    { data: 'IJ', left: false }
                ]
                assert.deepEqual( exp, tree.getProof( 0 ) )
            } )
            it( `B`, () => {
                const exp = [
                    { data: 'A', left: true },
                    { data: 'CD', left: false },
                    { data: 'EFGH', left: false },
                    { data: 'IJ', left: false }
                ]
                assert.deepEqual( exp, tree.getProof( 1 ) )
            } )
            it( `C`, () => {
                const exp = [
                    { data: 'D', left: false },
                    { data: 'AB', left: true },
                    { data: 'EFGH', left: false },
                    { data: 'IJ', left: false }
                ]
                assert.deepEqual( exp, tree.getProof( 2 ) )
            } )
            it( `D`, () => {
                const exp = [
                    { data: 'C', left: true },
                    { data: 'AB', left: true },
                    { data: 'EFGH', left: false },
                    { data: 'IJ', left: false }
                ]
                assert.deepEqual( exp, tree.getProof( 3 ) )
            } )
            it( `E`, () => {
                const exp = [
                    { data: 'F', left: false },
                    { data: 'GH', left: false },
                    { data: 'ABCD', left: true },
                    { data: 'IJ', left: false }
                ]
                assert.deepEqual( exp, tree.getProof( 4 ) )
            } )
            it( `F`, () => {
                const exp = [
                    { data: 'E', left: true },
                    { data: 'GH', left: false },
                    { data: 'ABCD', left: true },
                    { data: 'IJ', left: false }
                ]
                assert.deepEqual( exp, tree.getProof( 5 ) )
            } )
            it( `G`, () => {
                const exp = [
                    { data: 'H', left: false },
                    { data: 'EF', left: true },
                    { data: 'ABCD', left: true },
                    { data: 'IJ', left: false }
                ]
                assert.deepEqual( exp, tree.getProof( 6 ) )
            } )
            it( `H`, () => {
                const exp = [
                    { data: 'G', left: true },
                    { data: 'EF', left: true },
                    { data: 'ABCD', left: true },
                    { data: 'IJ', left: false }
                ]
                assert.deepEqual( exp, tree.getProof( 7 ) )
            } )
            it( `I`, () => {
                const exp = [
                    { data: 'J', left: false },
                    { data: 'ABCDEFGH', left: true },
                ]
                assert.deepEqual( exp, tree.getProof( 8 ) )
            } )
            it( `J`, () => {
                const exp = [
                    { data: 'I', left: true },
                    { data: 'ABCDEFGH', left: true },
                ]
                assert.deepEqual( exp, tree.getProof( 9 ) )
            } )
        } )
    } )

    describe( `verify`, () => {
        it( `C in ABCDE`, () => {
            const leaves = [ 'A', 'B', 'C', 'D', 'E' ]
            const tree = createMerkleTree( { leaves } )
            const root = 'ABCDE'
            const proof = tree.getProof( 2 )
            const rs = tree.verify( proof, 'C', root, tree.hashFn )
            assert.isTrue( rs )
        } )

    } )

} )