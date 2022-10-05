export class Context {

  #jsonLdContext: { [key: string]: string }
  #jsonLdContextInverted: { [key: string]: string } = {}

  constructor (jsonLdContext: { [key: string]: string }) {
    this.#jsonLdContext = jsonLdContext
    
    for (const [key, value] of Object.entries(jsonLdContext)) {
      if (key === '@vocab')  continue
      this.#jsonLdContextInverted[value] = key
    }
  }

  compactIri(iri: string, vocab = false) {
    let changed = true

    if (this.#jsonLdContext['@vocab'] && vocab) {
      iri = iri.replace(this.#jsonLdContext['@vocab'], '')
    }

    while (changed) {
      changed = false

      for (const [prefixIri, alias] of Object.entries(this.#jsonLdContextInverted)) {
        if (iri.startsWith(prefixIri) && !prefixIri.includes('://')) {
          iri = iri.replace(prefixIri, alias)
          changed = true
        }
      }

      for (const [prefixIri, alias] of Object.entries(this.#jsonLdContextInverted)) {
        if (iri.startsWith(prefixIri) && prefixIri.includes('://')) {
          iri = iri.replace(prefixIri, alias + ':')
          changed = true
        }
      }
    }

    return iri.trim()
  }

  getContextRaw () {
    return this.#jsonLdContext
  }
}