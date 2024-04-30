import { PromptTemplate } from "@langchain/core/prompts"

export const generateSelectorsPrompt = PromptTemplate.fromTemplate(`
Task:
Please simplify the included CSS selectors within the "selectors" key for each object in the domItems array? If it looks like there is className obfuscation going on, please simplify it using a contains rule. Please check that your rules are specific by running them against the below DOM:

Output:
Please output your response as an array of objects for each identified piece of PII/PCI. Include in each object the type, type of information, confidence level, and value as key/value pairs. If there is no PII/PCI, return an empty array with no additionl text.

domItems:
{domItems}

HTML:
{domTree}
`)
