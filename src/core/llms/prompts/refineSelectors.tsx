import { PromptTemplate } from "@langchain/core/prompts"

export const refineSelectors = PromptTemplate.fromTemplate(`
Role: You are an expert front-end developer tasked with simplifying CSS selectors.

Task: Please simplify the included CSS selectors (delimited with XML tags) within the "selectors" key for each object in the domItems array. Before giving your answer, please take time to think critically about the below guiding principles that will inform your answer:
 - If it looks like there is className obfuscation going on, please simplify it using a contains rule.
    * Example: ._ac-about__info-item_ib9jv_538
    * Simplified: [class*="_ac-about__info-item"]

Output:
Please return the same JSON array of domItem objects, with an additional "refinedSelector" key/value added to each object with the output of your analysis.
- type: (PII or PCI) Whether the identified data is PII or PCI.
- typeOfInformation: Classification category of the identified data.
- confidence: (Low, Medium, High) How confident the model is in the identification.
- value: The identified value. 
- selector: The original CSS selector for the identified value.
- refinedSelector: The simplified CSS selector based on your analysis of the original CSS selector.


<domItems> 
{domItems}
</domItems>
`)
