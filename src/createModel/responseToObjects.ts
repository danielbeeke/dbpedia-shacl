import { Context } from './Context'
import { RdfJsonRoot, Meta } from './types'
import { castValue } from './castValue'

const subjectIRI = 'http://subject.com/subject'

export const responseToObjects = <Type>(results: RdfJsonRoot, context: Context, meta: Meta) => {
  const objects: Array<{ [key: string]: any }> = []
  const typePredicate = context.compactIri('http://www.w3.org/1999/02/22-rdf-syntax-ns#type')

  for (const uri of Object.keys(results)) {
    const object: { [key: string]: any } = { id: context.compactIri(uri) }
    objects.push(object)
  }

  for (const [uri, predicates] of Object.entries(results)) {
    const object = objects.find(object => object.id === context.compactIri(uri))!

    const type = predicates["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"].find(item => item.value !== subjectIRI)!.value
    const compactedType = context.compactIri(type)

    for (const [predicate, values] of Object.entries(predicates)) {
      const compactedPredicate = context.compactIri(predicate, true)
      const propertyConfig = meta[compactedType][compactedPredicate]

      object[compactedPredicate] = propertyConfig.singular ? castValue(values[0], propertyConfig, context) : values.map(term => {
        if (term.type === 'uri' && compactedPredicate !== typePredicate) {
          const match = objects.find(object => object.id === context.compactIri(term.value))
          if (match) return match
        }
        return castValue(term, propertyConfig, context)
      }).filter(Boolean)
    }  
  }

  const output: Array<any> = objects.filter(object => object[typePredicate]?.includes(subjectIRI)) as unknown as Array<Type>

  for (const item of output) {
    item[typePredicate] = item[typePredicate].filter((item: any) => item !== subjectIRI)
  }

  return output
}