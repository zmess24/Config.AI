import { PromptTemplate } from "@langchain/core/prompts"

export const generatePrompt = PromptTemplate.fromTemplate(`
Role: You are an expert front-end developer who specializes in DOM manipulation and is especially knowledgeable around CSS selector generation.

Task: Identify any Personally Identifiable Information (PII) or Payment Card Information (PCI) in the following text and generate a CSS selector that would specifically target it in the DOM Structure. Consider the context of the text to avoid false positives.

Instructions:
1. List any PII/PCI found in the text. PII might include names, email addresses, phone numbers, and addresses. PCI includes credit card numbers. If uncertain, mark as "uncertain".
2. For each piece of PII/PCI identified, provide an array of objects with the following information:
   - informationType
   - cssSelector
   - confidence

Text:
<div xmlns="http://www.w3.org/1999/xhtml" class="_page__content_2gzeh_256 _page__content--account_2gzeh_301"><div class="_ac__block_ib9jv_358 _ac__block--small_ib9jv_381"><div class="_ac__block-wrapper_ib9jv_385"><h2 class="_ac__hdg_ib9jv_358">ABOUT YOU</h2><div class="_ac-about_ib9jv_522"><ul class="_ac-about__info_ib9jv_526"><li class="_ac-about__info-item_ib9jv_538"><p class="_ac-about__info-title_ib9jv_550">first name</p><p class="_ac-about__info-copy_ib9jv_558">Zac</p></li><li class="_ac-about__info-item_ib9jv_538"><p class="_ac-about__info-title_ib9jv_550">last name</p><p class="_ac-about__info-copy_ib9jv_558">Messinger</p></li><li class="_ac-about__info-item_ib9jv_538"><p class="_ac-about__info-title_ib9jv_550">email address</p><p class="_ac-about__info-copy_ib9jv_558">zmessinger@quantummetric.com</p></li><li class="_ac-about__info-item_ib9jv_538"><p class="_ac-about__info-title_ib9jv_550">password</p><div><form novalidate=""><button type="submit" class="_ac-about__info-copy_ib9jv_558 _ac-about__info-copy--underline_ib9jv_566">send reset email</button></form></div></li><li class="_ac-about__info-item_ib9jv_538"><a class="_ac-about__info-title_ib9jv_550 flex"><div class="flex border-b-2 border-brown-1 pb-1">Wishlist<div class="-mt-[2px] pl-1.5"></div></div></a></li></ul></div></div></div></div>

CSS Selector Generation Instructions:

- Prioritize the use of ID's, then class names, and then data-attributes for use in each generated selector.
- Make the selectors as simple as possible. Ideally, you would only need to use a single selector to target the element.
- If it looks like there might CSS obfuscation in the target selector, apply a [attribute*=value] selector to make the selector a little more generic and more resistant to changes. As an example: 
  - Original CSS selector: "p._ac-address__block_ib9jv_893"'
  - Desired CSS selector: "p[class*="_ac-address__block"]
`)
