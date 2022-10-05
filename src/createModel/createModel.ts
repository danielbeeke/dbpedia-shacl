import { responseToObjects } from './responseToObjects'
import { Prefixes, Meta } from './types'
import { Context } from './Context'

export const createModel = <Type>(endpoint: string, { prefixes, meta, query }: { prefixes: Prefixes, meta: Meta, query: string }) => {

  const objectCache: Map<string, Type> = new Map()
  const context = new Context(prefixes)

  function get (iris: Array<string>): Promise<Array<Type>>
  function get (iri: string): Promise<Type>
  async function get (input: Array<string> | string) {
    const iris = typeof input === 'string' ? [input] : input
    const compactedIris = iris.map(iri => context.compactIri(iri))

    const uncachedIris = compactedIris.filter(iri => !objectCache.has(iri))
    const cachedIris = compactedIris.filter(iri => objectCache.has(iri))

    const cachedObjects = cachedIris.map(iri => objectCache.get(iri))

    const values = uncachedIris.map(iri => iri.includes('://') ? `<${iri}>` : iri)

    let newObjects = []

    if (uncachedIris.length) {
      const preparedQuery = query.replace('VALUES ?s { }', `VALUES ?s { ${values.join(' ')} }`)

      const body = new FormData()
      body.set('query', preparedQuery)
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { accept: 'application/rdf+json' },
        body
      })  

      const results = await response.json()
      newObjects = responseToObjects(results, context, meta)
      for (const object of newObjects) {
        Object.freeze(object)
        objectCache.set(object.id, object)
      }
    }
    
    const output = [
      ...newObjects,
      ...cachedObjects
    ]

    return typeof input === 'string' ? output.pop() : output  
  }

  return { get }
}