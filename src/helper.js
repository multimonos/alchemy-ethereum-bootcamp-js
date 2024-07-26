export const tap = tag => x => {
    console.log( tag, x.toString() )
    return x
}