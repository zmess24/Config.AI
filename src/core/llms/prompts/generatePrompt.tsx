import { PromptTemplate } from "@langchain/core/prompts"

export const generatePrompt = PromptTemplate.fromTemplate(`
Role: You are an expert front-end developer who specializes in DOM manipulation and is especially knowledgeable around CSS selector generation.

Task: Identify any Personally Identifiable Information (PII) or Payment Card Information (PCI) in the following text and select the corresponding element from the DOM structure. Consider the context of the text to avoid false positives.

Text:

<div xmlns="http://www.w3.org/1999/xhtml" class="_page__content_2gzeh_256 _page__content--account_2gzeh_301"><div class="_ac__block_ib9jv_358 _ac__block--small_ib9jv_381"><div class="_ac__block-wrapper_ib9jv_385"><h2 class="_ac__hdg_ib9jv_358">ABOUT YOU</h2><div class="_ac-about_ib9jv_522"><ul class="_ac-about__info_ib9jv_526"><li class="_ac-about__info-item_ib9jv_538"><p class="_ac-about__info-title_ib9jv_550">first name</p><p class="_ac-about__info-copy_ib9jv_558">Zac</p></li><li class="_ac-about__info-item_ib9jv_538"><p class="_ac-about__info-title_ib9jv_550">last name</p><p class="_ac-about__info-copy_ib9jv_558">Messinger</p></li><li class="_ac-about__info-item_ib9jv_538"><p class="_ac-about__info-title_ib9jv_550">email address</p><p class="_ac-about__info-copy_ib9jv_558">zmessinger@quantummetric.com</p></li><li class="_ac-about__info-item_ib9jv_538"><p class="_ac-about__info-title_ib9jv_550">password</p><div><form novalidate=""><button type="submit" class="_ac-about__info-copy_ib9jv_558 _ac-about__info-copy--underline_ib9jv_566">send reset email</button></form></div></li><li class="_ac-about__info-item_ib9jv_538"><a class="_ac-about__info-title_ib9jv_550 flex"><div class="flex border-b-2 border-brown-1 pb-1">Wishlist<div class="-mt-[2px] pl-1.5"></div></div></a></li></ul></div></div></div></div>
Instructions:
1. List any PII/PCI found in the text. PII might include names, email addresses, phone numbers, and addresses. PCI includes credit card numbers. If uncertain, mark as "uncertain".
2. For each piece of PII/PCI identified, provide an array of objects with the following information:
   - informationType
   - cssSelector
   - confidence

CSS Selector Generation Instructions:

- Prioritize making each generated selector as simple as possible. Where possible, use the least number of elements in the selector. Try to avoid using child selectors
- Try to group CSS selectors together where you can into a single element.
- Assume that the PII/PCI in the elements you identify might be different from the text you are given.
- Prioritize the use of ID's, then class names, and then data-attributes for use in each generated selector.
- If it looks like there might CSS obfuscation in the target selector, apply a [attribute*=value] selector to make the selector a little more generic and more resistant to changes. As an example: 
  - Original CSS selector: "p._ac-address__block_ib9jv_893"'
  - Desired CSS selector: "p[class*="_ac-address__block"]
`)

<main xmlns="http://www.w3.org/1999/xhtml" role="main" id="mainContent" class="relative pt-[94px]"><div class="mx-auto pb-4 md:pb-5"><div class="mb-[100px] mt-4 flex justify-center"><div class="w-full max-w-[600px] px-[22px]"><div class="mx-auto mb-[25px] md:pb-[20px]"><h1 class="text-center text-[18px] leading-[35px]">WELCOME BACK</h1><div class="mx-auto my-[-3px] max-w-[254px] text-center"><p class="inline-block text-center text-[14px] leading-[18px]">Login to Your Account</p></div><div class="mx-auto my-[-3px] max-w-[254px] text-center"><p class="inline-block text-center text-[14px] leading-[18px]">Don't have an account?</p><a class="ml-1 inline-block text-[14px] underline">Register</a></div></div><form novalidate="" class="pb-[22px]"><div class="mb-1"><label for="accountLoginEmail" class="mb-[7px] block text-[12px]">Email</label><input class="focus:shadow-outline mb-1 w-full appearance-none rounded border py-[14px] px-[13px] text-[14px] leading-tight text-[#62554a] border-gray-900" id="accountLoginEmail" name="email" type="email" autocomplete="email" required="" placeholder="Email" aria-label="Email" value="" /><p class="text-xs text-red-500 invisible">  </p></div><div class="mb-1"><label for="accountLoginPassword" class="mb-[7px] block text-[12px]">Password</label><input class="focus:shadow-outline mb-1 w-full appearance-none rounded border py-[14px] px-[13px] text-[14px] leading-tight text-[#62554a] border-gray-900" id="accountLoginPassword" name="password" type="password" autocomplete="off" placeholder="Password" aria-label="Password" minlength="8" required="" value="" /><p class="text-xs text-red-500 invisible">  </p></div><div class="flex items-center justify-between"><button class="text-white focus:shadow-outline block h-[45px] w-full rounded bg-gray-900 py-2 px-4 uppercase" type="submit"><h2 class="text-[15px]">SIGN IN</h2></button></div><div class="mt-4 flex items-center justify-between"><a class="mx-auto inline-block align-baseline"><h2 class="text-[15px] uppercase underline">Forgot password?</h2></a></div></form></div></div></div></main>