import './style.css'

import { createModel } from './createModel/createModel'
import Philosopher, * as PhilosopherMeta from './models/Philosopher'

const Philosopher = createModel<Philosopher>('https://dbpedia.org/sparql', PhilosopherMeta)

const items = await Philosopher.get([
  'dbr:Søren_Kierkegaard', 
  'dbr:Immanuel_Kant',
  'dbr:Friedrich_Nietzsche',
  'dbr:Plato',
])

console.log(items.map(item => item.label))