export const generateSelectorsSchema = {
	name: "generateSelectors",
	description: "Extracts PII and PCI from text data",
	parameters: {
		type: "object", // Ensuring the top-level schema is an object
		properties: {
			domItems: {
				// Encapsulating the array within an object property
				type: "array",
				items: {
					type: "object",
					properties: {
						type: {
							type: "string",
							enum: ["PII", "PCI"],
							description:
								"Whether the identified data is PII or PCI."
						},
						typeOfInformation: {
							type: "string",
							description:
								"Classification category of the identified data."
						},
						confidence: {
							type: "string",
							enum: ["Low", "Medium", "High"],
							description:
								"How confident the model is in the identification."
						},
						value: {
							type: "string",
							description: "The identified value."
						}
					},
					required: [
						"type",
						"typeOfInformation",
						"confidence",
						"value"
					]
				}
			}
		},
		required: ["entries"]
	}
}
