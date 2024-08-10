import { assert, beforeAll, describe, it } from "vitest";

const createNode = (
    {
        key = null,
        children = {},
        isWord = false,
    } = {} ) => ({
    type: 'trie_node',
    key,
    children,
    isWord,
})

const createTrie = (
    {} = {} ) => ({
    type: 'trie',
    root: createNode(),
    insert( word ) {
        this._addFirstCharAsNode( this.root, word )
    },
    _addFirstCharAsNode( parentNode, word ) {
        const key = word[0]

        const keyExists = typeof parentNode.children[key] !== "undefined"


        if ( ! keyExists ) {
            const isWord = word.length === 1
            const node = createNode( {
                key,
                isWord
            } )

            parentNode.children[key] = node
        }

        // console.log( '_'.repeat( word.length ), key + (! keyExists ? "'" : '*') )

        if ( word.length === 1 ) {
            return
        }

        this._addFirstCharAsNode( parentNode.children[key], word.slice( 1 ) )
    },
    contains( word ) {
        return this._hasWord( this.root, word )
    },
    _hasWord( node, word ) {
        // exhausted search
        if ( word.length === 0 ) return false

        const key = word[0]

        // failed to find this letter
        if ( ! node.children[key] ) return false


        // successful match
        if ( word.length === 1 && node.children[key] && node.children[key].isWord === true ) {
            console.log( 'found', key, 'of', word, '--> success' )
            return true
        }

        // console.log( 'found', key, 'of', word )

        // search next word slice
        return this._hasWord( node.children[key], word.slice( 1 ) )
    }
})

describe( `tries`, () => {

    describe( `node`, () => {
        it( `can be created`, () => {
            const n = createNode()
            assert.property( n, 'type' )
            assert.equal( n.type, 'trie_node' )
        } )
        it.each( [
            [ 'key' ],
            [ 'children' ],
            [ 'isWord' ],
        ] )( `.%s prop`, ( prop ) => {
            const n = createNode()
            assert.property( n, prop )
        } )
        it( `.key null by default`, () => {
            const n = createNode()
            assert.equal( null, n.key )
        } )
        it( `.children empty object by default`, () => {
            const n = createNode()
            assert.isObject( n.children )
        } )
        it( `.isWord false by default`, () => {
            const n = createNode()
            assert.isFalse( n.isWord )
        } )
        it( `.key is assigned`, () => {
            const n = createNode( { key: 'a' } )
            assert.equal( 'a', n.key )
        } )
    } )

    describe( `trie`, () => {
        it( `can be created`, () => {
            const t = createTrie()
            assert.property( t, 'type' )
            assert.equal( t.type, 'trie' )
        } )
        it.each( [
            [ 'root' ],
        ] )( `.%s prop`, ( prop ) => {
            const t = createTrie()
            assert.property( t, prop )
        } )
        it.each( [
            [ 'insert' ],
            [ 'contains' ],
        ] )( `.%s() function`, ( fn ) => {
            const t = createTrie()
            assert.isFunction( t[fn] )
        } )
        it( `.root is trie_node with null key`, () => {
            const t = createTrie()
            assert.equal( 'trie_node', t.root.type )
        } )

        describe( `.insert()`, () => {
            it( `inserts 'hey'`, () => {
                const t = createTrie()
                t.insert( 'hey' )
                // console.log( JSON.stringify( t, null, 4 ) )
                assert( null === t.root.key )
                assert( 'h' === t.root.children['h'].key )
                assert( 'e' === t.root.children['h'].children['e'].key )
                assert( 'y' === t.root.children['h'].children['e'].children['y'].key )
                assert.isTrue( t.root.children['h'].children['e'].children['y'].isWord )
            } )
        } )

        describe( `insert hello,hermit,helipad`, () => {
            let t

            beforeAll( () => {
                t = createTrie()
                t.insert( 'hello' )
                t.insert( 'hermit' )
                t.insert( 'helipad' )
                // console.log( JSON.stringify( t, null, 4 ) )
            } )
            it( `.root is null`, () => {
                assert( null === t.root.key )
            } )
            it( `insert 'hello'`, () => {
                assert( 'h' === t.root.children['h'].key )
                assert( 'e' === t.root.children['h'].children['e'].key )
                assert( 'l' === t.root.children['h'].children['e'].children['l'].key )
                assert( 'l' === t.root.children['h'].children['e'].children['l'].children['l'].key )
                assert( 'o' === t.root.children['h'].children['e'].children['l'].children['l'].children['o'].key )
            } )
            it( `'o' in hello is word`, () => {
                assert.isTrue( t.root.children['h'].children['e'].children['l'].children['l'].children['o'].isWord )
            } )
            it( `insert 'hermit'`, () => {
                assert( 'h' === t.root.children['h'].key )
                assert( 'e' === t.root.children['h'].children['e'].key )
                assert( 'r' === t.root.children['h'].children['e'].children['r'].key )
                assert( 'm' === t.root.children['h'].children['e'].children['r'].children['m'].key )
                assert( 'i' === t.root.children['h'].children['e'].children['r'].children['m'].children['i'].key )
                assert( 't' === t.root.children['h'].children['e'].children['r'].children['m'].children['i'].children['t'].key )
            } )
            it( `'t' in hermit is word`, () => {
                assert.isTrue( t.root.children['h'].children['e'].children['r'].children['m'].children['i'].children['t'].isWord )
            } )
            it( `insert 'helipad'`, () => {
                assert( 'h' === t.root.children['h'].key )
                assert( 'e' === t.root.children['h'].children['e'].key )
                assert( 'l' === t.root.children['h'].children['e'].children['l'].key )
                assert( 'i' === t.root.children['h'].children['e'].children['l'].children['i'].key )
                assert( 'p' === t.root.children['h'].children['e'].children['l'].children['i'].children['p'].key )
                assert( 'a' === t.root.children['h'].children['e'].children['l'].children['i'].children['p'].children['a'].key )
                assert( 'd' === t.root.children['h'].children['e'].children['l'].children['i'].children['p'].children['a'].children['d'].key )
            } )
            it( `'d' in helipad is word`, () => {
                assert.isTrue( t.root.children['h'].children['e'].children['l'].children['i'].children['p'].children['a'].children['d'].isWord )
            } )
        } )

        describe( `contains()`, () => {
            let t
            beforeAll( () => {
                t = createTrie()
                t.insert( 'happy' )
                t.insert( 'healthy' )
            } )
            it.each( [
                [ 'happy' ],
                [ 'healthy' ],
            ] )( `contains '%s'`, ( word ) => {
                assert.isTrue( t.contains( word ) )
            } )
            it.each( [
                [ 'whimscial' ],
                [ 'health' ],
            ] )( `does not contain '%s'`, ( word ) => {
                assert.isFalse( t.contains( word ) )
            } )
        } )
    } )

} )