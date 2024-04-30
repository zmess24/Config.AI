import { PromptTemplate } from "@langchain/core/prompts"

export const generateSelectorsPrompt = PromptTemplate.fromTemplate(`
Can you simplify the listed CSS selectors? If it looks like there is className obfuscation going on, please simplify it using a contains rule. Please check that your rules are specific by running them against the below DOM:

Selector:
{selectors}

HTML:
{html}
`)
