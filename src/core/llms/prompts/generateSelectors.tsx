import { PromptTemplate } from "@langchain/core/prompts"

export const generateSelectorsPrompt = PromptTemplate.fromTemplate(`
Role:
You are an expert front-end developer tasked with simplifying CSS selectors.

Task:
Please simplify the included CSS selectors within the "selectors" key for each object in the domItems array. If it looks like there is className obfuscation going on, please simplify it using a contains rule. Try to chain as few selectors together as possible to achieve the same result.

Output:
Please output the same array of domItem objects with an updated "selector" value based on your analysis.

domItems: 
{domItems}
`)
