import { PromptTemplate } from "@langchain/core/prompts"

export const generatePrompt = PromptTemplate.fromTemplate(`
Role: You are an expert front-end developer, masterful at DOM manipulation and CSS selector generation.

Task: Generate CSS selectors for identifying Personally Identifiable Information (PII) and  Payment Card Information (PCI) in the provided HTML snippet.

Instructions:

1. Selector Preference:Selector Preference: Use attribute-based selectors that target ids and/or classes containing specific substrings. For instance, rather than using precise class names or structural paths, employ selectors like [class*="part-of-class-name"] to achieve broader targeting that is resilient to changes in class naming conventions or minor DOM structure adjustments.

2. Information Types: List any PII or PCI found in the text. PII might include names, email addresses, phone numbers, and addresses, while PCI might include any credit card or banking information.
3. Selector Details:
    - Simplicity: Aim for simplicity in selectors, ideally using a single attribute-based selector per element when possible.
    - Generality vs. Specificity: Balance the need to avoid overly broad selectors that might capture unrelated elements. Focus on parts of class names that are unique enough to reliably identify the target data without capturing unintended elements.
    - Robustness: Ensure the selectors are robust against common structural changes in the website’s layout or class name updates.
4. Output: For each piece of PII or PCI identified, provide an array of objects with the following information:
    - informationType: The type of information identified (First Name, Last Name, Phone Number, ect).
    - classification: The classification of the information identified (e.g., PII, PCI).
    - selector: The CSS selector that would target the identified information in the provided HTML snippet.
    - confidence: Your confidence level in the accuracy of the CSS selector.
    
HTML Snippet:

<div xmlns="http://www.w3.org/1999/xhtml" class="_ac-about_ib9jv_522"><ul class="_ac-about__info_ib9jv_526"><li class="_ac-about__info-item_ib9jv_538"><p class="_ac-about__info-title_ib9jv_550">first name</p><p class="_ac-about__info-copy_ib9jv_558">Zac</p></li><li class="_ac-about__info-item_ib9jv_538"><p class="_ac-about__info-title_ib9jv_550">last name</p><p class="_ac-about__info-copy_ib9jv_558">Messinger</p></li><li class="_ac-about__info-item_ib9jv_538"><p class="_ac-about__info-title_ib9jv_550">email address</p><p class="_ac-about__info-copy_ib9jv_558">zmessinger@quantummetric.com</p></li><li class="_ac-about__info-item_ib9jv_538"><p class="_ac-about__info-title_ib9jv_550">password</p><div><form novalidate=""><button type="submit" class="_ac-about__info-copy_ib9jv_558 _ac-about__info-copy--underline_ib9jv_566">send reset email</button></form></div></li><li class="_ac-about__info-item_ib9jv_538"><a class="_ac-about__info-title_ib9jv_550 flex"><div class="flex border-b-2 border-brown-1 pb-1">Wishlist<div class="-mt-[2px] pl-1.5"></div></div></a></li></ul></div>
`)
