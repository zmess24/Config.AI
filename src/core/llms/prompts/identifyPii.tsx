import { PromptTemplate } from "@langchain/core/prompts"

export const identifyPiiPrompt = PromptTemplate.fromTemplate(`
Role: 
You are an expert data security analyst skilled in identifying PII/PCI data in text.

Task:
Please intifiy any PII/PCI below in the following stringified text scraped from a webpage in the 'Text' section. Please consider any additional rules listed in the 'Rules' section, and keep in mind you may need to adjacent text as context in making your determination.

Text:
{pageText}

Rules:
{rules}

Output:
Please output your response as an array of objects for each identified piece of PII/PCI. Include in each object the type, type of information, confidence level, and value as key/value pairs. If there is no PII/PCI, return an empty array with no additionl text.
`)
