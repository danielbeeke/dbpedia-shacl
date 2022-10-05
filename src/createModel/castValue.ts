import { RdfJsonTerm } from './types'
import { Context } from './Context'

export const castValue = (value: RdfJsonTerm, propertyConfig: { singular: boolean, type: string }, context: Context) => {
  if (propertyConfig.type === 'Date') return new Date(value.value)

  if (value.type === 'uri') {
    return context.compactIri(value.value)
  }

  return value.value
}