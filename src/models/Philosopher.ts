export const prefixes = {"rdf":"http://www.w3.org/1999/02/22-rdf-syntax-ns#","rdfs":"http://www.w3.org/2000/01/rdf-schema#","foaf":"http://xmlns.com/foaf/0.1/","ex":"http://example.org/","sh":"http://www.w3.org/ns/shacl#","xsd":"http://www.w3.org/2001/XMLSchema#","dbp":"http://dbpedia.org/property/","dbo":"http://dbpedia.org/ontology/","dbr":"http://dbpedia.org/resource/","schema":"https://schema.org/","a":"rdf:type","label":"rdfs:label","@vocab":"http://dbpedia.org/property/"}
export const meta = {"dbo:Philosopher":{"label":{"singular":true,"type":"string"},"a":{"singular":false,"type":"string"},"birthPlace":{"singular":false,"type":"Location"},"birthDate":{"singular":true,"type":"Date"}},"dbo:Location":{"a":{"singular":false,"type":"string"},"name":{"singular":true,"type":"string"}}}
export const query = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX ex: <http://example.org/>
PREFIX sh: <http://www.w3.org/ns/shacl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX dbp: <http://dbpedia.org/property/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX schema: <https://schema.org/>

CONSTRUCT {
	?s a <http://subject.com/subject> .


	# label
	?s <http://www.w3.org/2000/01/rdf-schema#label> ?label .

	# a
	?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?a .

	# birthPlace
	?s dbp:birthPlace ?birthPlace .
	# birthPlace_a
	?birthPlace <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?birthPlace_a .

	# birthPlace_name
	?birthPlace dbp:name ?birthPlace_name .

	# birthDate
	?s dbp:birthDate ?birthDate .
}
WHERE {
	VALUES ?s { }

	# label
	OPTIONAL {
		?s <http://www.w3.org/2000/01/rdf-schema#label> ?label_en .
		FILTER (lang(?label_en) = 'en')
	}
	OPTIONAL {
		?s <http://www.w3.org/2000/01/rdf-schema#label> ?label_nl .
		FILTER (lang(?label_nl) = 'nl')
	}
	BIND(COALESCE(?label_en, ?label_nl) as ?label)
	FILTER(?label)


	# a
	?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?a .
	FILTER (?a IN (<http://dbpedia.org/ontology/Philosopher>))

	# birthPlace
	OPTIONAL {
		?s dbp:birthPlace ?birthPlace .
	# birthPlace_a
	?birthPlace <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?birthPlace_a .
	FILTER (?birthPlace_a IN (<http://dbpedia.org/ontology/Location>))

	# name
	OPTIONAL {
		?birthPlace dbp:name ?birthPlace_name_en .
		FILTER (lang(?birthPlace_name_en) = 'en')
	}
	OPTIONAL {
		?birthPlace dbp:name ?birthPlace_name_nl .
		FILTER (lang(?birthPlace_name_nl) = 'nl')
	}
	BIND(COALESCE(?birthPlace_name_en, ?birthPlace_name_nl) as ?birthPlace_name)
	FILTER(?birthPlace_name)

	}

	# birthDate
	OPTIONAL {
		?s dbp:birthDate ?birthDate .
	}
}
`
export type Philosopher = {
  label: string,
  type: Array<any>,
  birthPlace?: Array<Location>,
  birthDate?: Date
}
export default Philosopher



export type Location = {
  type: Array<any>,
  name: string
}

    