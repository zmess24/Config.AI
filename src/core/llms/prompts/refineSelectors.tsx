import { PromptTemplate } from "@langchain/core/prompts"

export const refineSelectors = PromptTemplate.fromTemplate(`
You are an expert front-end developer tasked with simplifying CSS selectors.

Task: Please simplify the included CSS selectors within the "selectors" key for each object in the domItems array, taking into the account the below points into consideration:
 - If it looks like there is className obfuscation going on, please simplify it using a contains rule. 
 - Try to chain as few selectors together as possible to achieve the same result.
 - If you think each of the different selectors can be combined into a single selector, please do so.

Output:
Please output the same array of domItem objects with an updated "selector" value based on your analysis.

domItems: 
{domItems}
`)
