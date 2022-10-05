# DBpedia SHACL

This example repository shows an easy way of fetching data from a SPARQL endpoint.
How?

- Define SHACL shape
- Integrate `deno run --allow-all https://deno.land/x/shacl_to_type@v0.0.8/cli.ts shapes src/models dbp` in your build process. I used predev inside the package.json here.

### Usage

```
import { createModel } from './createModel/createModel'
import Philosopher, * as PhilosopherMeta from './models/Philosopher'
const Philosopher = createModel<Philosopher>('https://dbpedia.org/sparql', PhilosopherMeta)
const items = await Philosopher.get([
  'dbr:Søren_Kierkegaard', 
  'dbr:Immanuel_Kant',
  'dbr:Friedrich_Nietzsche',
  'dbr:Plato',
])

// Or

const items = await Philosopher.get('dbr:Søren_Kierkegaard')

```