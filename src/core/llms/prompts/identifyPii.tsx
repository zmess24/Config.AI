import { PromptTemplate } from "@langchain/core/prompts"

export const identifyPiiPrompt = PromptTemplate.fromTemplate(`
Role: 
You are an expert data security analyst skilled in identifying PII/PCI data in text.

Task:
Please identify any instances of PII/PCI in the following text scraped from a webpage in the 'Text' section. List each piece of identified PII/PCI as it's own item. Please consider any additional rules listed in the 'Rules' section, and keep in mind you may need to use adjacent text for additional context in making your determination of whether to classifiy an item as sensitive information or not.

Text:
{pageText}

Rules:
{rules}

Output:
Please return a JSON array of objects for each identified piece of PII/PCI with the below properties in each object, with no additional text. If there are identified pieces of text with PII/PCI, return an empty JSON array with no additionl text.
- type: (PII or PCI) Whether the identified data is PII or PCI.
- typeOfInformation: Classification category of the identified data.
- confidence: (Low, Medium, High) How confident the model is in the identification.
- value: The identified value. 
`)
