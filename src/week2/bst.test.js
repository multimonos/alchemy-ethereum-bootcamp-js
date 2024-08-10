import { assert, beforeEach, describe, it } from "vitest";


const createNode = ( data ) => ({
    type: 'node',
    data,
    left: null,
    right: null,
})

const createTree = () => ({
    type: 'tree',
    root: null,
    addNode( newNode ) {
        this.root = this._add( newNode, this.root )
        // console.log( JSON.stringify( this.root, null, 4 ) )
    },
    _add( child, parent ) {

        // set
        if ( ! parent ) {
            // if parent null, then this is some kind
            // of leaf, so, retun the node which will
            // set the value in calling code
            return child
        }

        if ( child.data < parent.data ) {
            parent.left = this._add( child, parent.left )
            return parent
        }

        parent.right = this._add( child, parent.right )
        return parent
    },
    hasNode( node ) {
        return this._find( node, this.root )
    },
    _findValue( val ) {
        const node = createNode( val )
        return this._find( node, this.root )
    },
    _find( node, parent ) {
        if ( ! parent ) return false
        if ( parent.data === node.data ) return true
        return node.data < parent.data
            ? this._find( node, parent.left )
            : this._find( node, parent.right )
    }
})


describe( `binary search tree`, () => {

    describe( `node`, () => {
        it( `.data exists`, () => {
            const node = createNode()
            assert.property( node, "data" )
        } )
        it( `.left exists`, () => {
            const node = createNode()
            assert.property( node, "left" )
        } )
        it( `.right exists`, () => {
            const node = createNode()
            assert.property( node, "right" )
        } )
        it( `.type exists`, () => {
            const node = createNode()
            assert.property( node, "type" )
            assert.equal( 'node', node.type )
        } )
    } )


    describe( `tree`, () => {
        it( `.type exists`, () => {
            const tree = createTree()
            assert.property( tree, "type" )
            assert.equal( 'tree', tree.type )
        } )
        it( `.root exists`, () => {
            const tree = createTree()
            assert.property( tree, 'root' )
            assert.equal( null, tree.root )
        } )
        describe( `.addNode()`, () => {
            it( `is function`, () => {
                const tree = createTree()
                assert.isFunction( tree.addNode )
            } )
            it( `adds first node as root`, () => {
                const tree = createTree()
                assert.equal( null, tree.root )
                const node = createNode( 5 )
                tree.addNode( node )
                assert.equal( 'node', tree.root.type )
            } )
            it( `adds node to left`, () => {
                const tree = createTree()
                assert.equal( null, tree.root )
                const root = createNode( 5 )
                const left = createNode( 3 )
                tree.addNode( root )
                tree.addNode( left )
                assert( root.data === tree.root.data )
                assert( left.data === tree.root.left.data )
            } )
            it( `adds node to right`, () => {
                const tree = createTree()
                assert.equal( null, tree.root )
                const root = createNode( 5 )
                const right = createNode( 7 )
                tree.addNode( root )
                tree.addNode( right )
                assert( root.data === tree.root.data )
                assert( right.data === tree.root.right.data )
            } )
            it( `adds 3 nodes correctly`, () => {
                const tree = createTree()
                assert.equal( null, tree.root )
                const root = createNode( 5 )
                const right = createNode( 7 )
                const left = createNode( 3 )
                tree.addNode( root )
                tree.addNode( right )
                tree.addNode( left )
                assert( root.data === tree.root.data )
                assert( left.data === tree.root.left.data )
                assert( right.data === tree.root.right.data )
            } )
            it( `adds many nodes correctly`, () => {
                const tree = createTree()
                assert.equal( null, tree.root )
                const root = createNode( 5 )
                const r0 = createNode( 7 )
                const l0 = createNode( 3 )
                const a = createNode( 2 )
                const b = createNode( 1 )
                const c = createNode( 6 )
                const d = createNode( 15 )
                const e = createNode( 13 )
                tree.addNode( root )
                tree.addNode( r0 )
                tree.addNode( l0 )
                tree.addNode( a )
                tree.addNode( b )
                tree.addNode( c )
                tree.addNode( d )
                tree.addNode( e )
                assert( root.data === tree.root.data )
                assert( l0.data === tree.root.left.data )
                assert( r0.data === tree.root.right.data )
                assert( a.data === tree.root.left.left.data )
                assert( b.data === tree.root.left.left.left.data )
                assert( c.data === tree.root.right.left.data )
                assert( d.data === tree.root.right.right.data )
                assert( e.data === tree.root.right.right.left.data )
            } )
        } )
        describe( `hasNode()`, () => {
            let tree
            beforeEach( () => {
                tree = createTree()
                assert.equal( null, tree.root )
                const root = createNode( 5 )
                const r0 = createNode( 7 )
                const l0 = createNode( 3 )
                const a = createNode( 2 )
                const b = createNode( 1 )
                const c = createNode( 6 )
                const d = createNode( 15 )
                const e = createNode( 13 )
                tree.addNode( root )
                tree.addNode( r0 )
                tree.addNode( l0 )
                tree.addNode( a )
                tree.addNode( b )
                tree.addNode( c )
                tree.addNode( d )
                tree.addNode( e )
            } )

            it.each( [
                [ 1 ],
                [ 2 ],
                [ 3 ],
                [ 5 ],
                [ 6 ],
                [ 7 ],
                [ 13 ],
                [ 15 ],
            ] )( 'found %i', ( a ) => {
                const rs = tree.hasNode( createNode( a ) )
                assert.isTrue( rs )
            } )

            it.each( [
                [ 4 ],
                [ 8 ],
                [ 9 ],
                [ 10 ],
                [ 11 ],
                [ 12 ],
            ] )( 'did not find %i', ( a ) => {
                const rs = tree.hasNode( createNode( a ) )
                assert.isFalse( rs )
            } )
        } )

        describe.only( `alchemy case`, () => {
            it( `should pass`, () => {
                const tree = createTree()
                tree.addNode( createNode( 5 ) )
                assert( tree.root.data === 5 )
                assert.isTrue( tree.hasNode( createNode( 5 ) ) )
                assert.isFalse( tree.hasNode( createNode( 4 ) ) )
                tree.addNode( createNode( 3 ) )
                assert.isTrue( tree.hasNode( createNode( 3 ) ) )
                tree.addNode( createNode( 4 ) )
                assert.isTrue( tree.hasNode( createNode( 4 ) ) )
                tree.addNode( createNode( 7 ) )
                assert.isTrue( tree.hasNode( createNode( 7 ) ) )

            } )
        } )
    } )
} )
