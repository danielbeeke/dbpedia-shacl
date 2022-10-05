export type RdfJsonTerm = {
  type: 'bnode' | 'uri' | 'literal' | 'defaultgraph',
  value: string,
  lang?: string,
  datatype?: string
}

export type RdfJsonRoot = {
  [key: string]: {
    [key: string]: Array<RdfJsonTerm>
  }
}

export type Meta = { [key: string]: { [key: string]: { singular: boolean, type: string } } }

export type Prefixes = { [key: string]: string }
