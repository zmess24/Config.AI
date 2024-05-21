import { PromptTemplate } from "@langchain/core/prompts"

export const identifyPiiPrompt = PromptTemplate.fromTemplate(`
Role: 
You are an expert data security analyst, skilled in identifying PII/PCI data in any provided text.

Task:
Please identify any instances of PII/PCI in the following JSON object (delimited with the <pagetext> XML tag) which contains enumerated text nodes scraped from a webpage. Before giving your answer, take time to think critically about the below guiding principles that will inform your answer:
- Please consider any additional rules listed in attached the rules section (delimited with the <piiRules> XML tag). 
- Keep in mind you may need to use adjacent the text from a previous and subsequent node for additional context in making your classification determinations. For example, in a phrase like "Hi Zac", "Zac" is most likely PII.

<pagetext>
{pageText}
</pagetext>

<piiRules>
Item | Treatment
First Name | PII
Last Name | PII
Full Name | PII
Email Address | PII
IP Address | PII
Username | PII
Password | PCI
Account Number | PII
Mailing Address	| PII
License Plate | PCI
License Number | PCI
Vin Number | PCI
SSN | PCI
Credit Card Details | PCI
DOB (Date of Birth) | PCI
Gift Card Numbers | PCI
Phone Number | PII
Shipping Tracking Numbers | PII
Banking Account Numbers | PCI
Routing Numbers | PCI
Pin Numbers of Any Kind | PCI
Login "Confidence" Images | PCI
Check Images (Mobile Uploads) | PCI
PNR (booking reference)	| PII
Order Number/ID	| PII
Payroll Data (role, comp, etc) | PCI
GPS, long/lat coordinates | PCI
CUSIP | PII
Personal Health Information	| PCI
Quote Reference Number (Insurance) | PII
TIN / Tax ID Numbers / EIN	| PCI
Contact Us (Free Form Response)	| PCI
Insurance Claim Numbers	| PII
</piiRules>

Output:
Please return a JSON array of objects for each identified piece of PII/PCI with the below properties in each object, with no additional text. If there are identified pieces of text with PII/PCI, return an empty JSON array with no additionl text.
- id: The id of the identified data in the input object
- type: (PII or PCI) Whether the identified data is PII or PCI.
- typeOfInformation: Classification category of the identified data.
- confidence: (Low, Medium, High) How confident the model is in the identification.
- value: The identified value. 
`)
