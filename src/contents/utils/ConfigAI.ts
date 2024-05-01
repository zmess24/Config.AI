import type { HtmlHTMLAttributes } from "react"
import { sendToBackground } from "@plasmohq/messaging"
import { print } from "./print"

interface ConfigAiInterface {
	provider: string
	isOn: boolean
	nonTextBasedSelectors: string
	cache: object
}

class ConfigAi implements ConfigAiInterface {
	provider: string
	isOn: boolean
	nonTextBasedSelectors: string
	inputTypes: string
	cache: object

	constructor(provider: string, isOn: boolean) {
		this.provider = provider
		this.isOn = isOn
		this.cache = JSON.parse(
			window.localStorage.getItem("config.ai") || "{}"
		)
		this.nonTextBasedSelectors =
			"script, style, img, noscript, iframe, video, audio, canvas, meta, svg, path"
		this.inputTypes = "input, textarea, select, label, option"

		print.log(
			`Provider: ${this.provider} | Session: ${this.isOn}`,
			"#3f51b5"
		)
	}

	/**
    |--------------------------------------------------
    | Private DOM Methods
    |--------------------------------------------------
    */

	#createTreeWalker(nodeFilter) {
		return document.createTreeWalker(document.body, nodeFilter, null)
	}

	#constructSelector(node, depth = 0, selector = "") {
		// End recursion if base cases are met
		if (depth === 4 || !node.parentNode) return selector.trim()
		if (node.id) return `#${node.id} ${selector}`.trim()
		let currentSelector = ""
		// Use the `name` attribute if present, which is less common but quite specific
		if (node.name) {
			currentSelector = `[name="${node.name}"]`
		}
		// Use classes, if available; consider using a specific class if multiple are present
		else if (node.className) {
			const classes = node.className.split(" ")
			if (classes.length > 0) {
				currentSelector = `.${classes.join(".")}`
			} else {
				currentSelector = node.tagName.toLowerCase() // Fallback to tagName if no suitable class found
			}
		}
		// Fallback to tagName if no other identifiers are present
		else {
			currentSelector = node.tagName.toLowerCase()
		}

		// Combine the current selector with the accumulated selectors
		selector = `${currentSelector} ${selector}`.trim()

		// Recurse, incrementing depth to limit recursion length
		return this.#constructSelector(node.parentNode, depth + 1, selector)
	}

	#constructInputSelector(input) {
		let selector = ""
		if (input.id) {
			selector = `input#${input.id}`
		} else if (input.name) {
			selector = `input[name="${input.name}"]`
		} else if (input.type) {
			selector = `input[type="${input.type}"]`
		} else if (input.placeholder) {
			selector = `input[placeholder="${input.placeholder}"]`
		} else if (input.ariaLabel) {
			selector = `input[aria-label="${input.ariaLabel}"]`
		} else if (input.className) {
			selector = `input.${input.className}`
		} else {
			selector = "input"
		}

		return selector
	}

	#pruneAndSerializeDOM(
		rootElement: HtmlHTMLAttributes,
		keepTextKeywords: Array<string>
	) {
		// Create a deep clone of the rootElement to work on
		const clonedElement = rootElement.cloneNode(true)

		// Find all elements matching the selectors within the clonedElement
		const nonTextBasedElements = clonedElement.querySelectorAll(
			this.nonTextBasedSelectors
		)

		// Convert NodeList to array to manipulate the DOM safely while iterating
		const elementsArray = Array.from(nonTextBasedElements)

		// Remove each non-text-based element from the DOM
		elementsArray.forEach((element: HTMLElement) =>
			element.parentNode.removeChild(element)
		)

		const allElements = clonedElement.querySelectorAll("*")

		// Remove non-essential attributes from all elements
		allElements.forEach((el: HTMLElement) => {
			// Get an array of attribute names to consider for removal
			const attributes = Array.from(el.attributes)
			attributes.forEach((attr: Attr) => {
				// Preserve only 'class', 'id', and '[data-*]' attributes
				if (
					attr.name !== "class" &&
					attr.name !== "id" &&
					!attr.name.startsWith("data-")
				) {
					el.removeAttribute(attr.name)
				}
			})
		})

		// Remove text from elements that do not contain specified keywords
		allElements.forEach((el: HTMLElement) => {
			Array.from(el.childNodes).forEach((child) => {
				if (child.nodeType === Node.TEXT_NODE) {
					const textContent = child.nodeValue.trim()
					const containsKeyword = keepTextKeywords.some(
						(keyword: any) => textContent.includes(keyword.value)
					)
					if (!containsKeyword) {
						child.nodeValue = "" // Clear the text node value
					}
				}
			})
		})

		const walker = this.#createTreeWalker(NodeFilter.SHOW_COMMENT)
		let currentNode = walker.nextNode()

		while (currentNode) {
			currentNode.parentNode.removeChild(currentNode)
			currentNode = walker.nextNode()
		}
		// Serialize the pruned DOM tree to a string
		const serializer = new XMLSerializer()
		const serializedDOM = serializer.serializeToString(clonedElement)
		return serializedDOM
	}

	#findNodesWithPII(piiList) {
		const textNodes = []
		const walker = this.#createTreeWalker(NodeFilter.SHOW_TEXT)
		let node

		while ((node = walker.nextNode())) {
			piiList.forEach((data) => {
				if (
					node.textContent.includes(data.value) &&
					node.parentNode.nodeName !== "SCRIPT"
				) {
					if (node.parentNode.nodeName !== "LABEL") {
						let selector = this.#constructSelector(
							node.parentNode,
							0
						)
						data.selector = selector
					} else {
						data.delete = true
					}
				}
			})
		}

		return textNodes
	}

	#highlightNodesWithPII(domItems) {
		domItems.forEach((data) => {
			const elements = document.querySelectorAll(data.selector)
			elements.forEach((element) => {
				element.style.transition = "all 0.5s ease-in"
				element.style.backgroundColor = "#A5B4FC"
				element.style.border = "2px solid #4338ca"
			})
		})
	}

	#findInputFields(domItems) {
		const inputs = document.querySelectorAll("input")
		// Filter to get only visible inputs
		const visibleInputs = Array.from(inputs).filter((input) => {
			const style = window.getComputedStyle(input)
			return (
				style.display !== "none" &&
				style.visibility !== "hidden" &&
				input.offsetWidth > 0 &&
				input.offsetHeight > 0
			)
		})

		// Iterate over all input fields in the DOM
		visibleInputs.forEach((input) => {
			let domItem = {
				type: "Input",
				typeOfInformation: "Input Field",
				confidence: "High",
				value: "",
				selector: this.#constructInputSelector(input)
			}

			domItems.push(domItem)
		})

		return domItems
	}

	/**
    |--------------------------------------------------
    | Private Cache Methods
    |--------------------------------------------------
    */

	#saveToCache(payload, url: string, type: string) {
		print.table(payload)
		if (this.cache[url]) {
			this.cache[url][type] = [...this.cache[url][type], ...payload]
		} else {
			this.cache[url] =
				type === "domItems"
					? { domItems: [...payload], apiItems: [] }
					: { domItems: [], apiItems: [...payload] }
		}

		localStorage.setItem("config.ai", JSON.stringify(this.cache))
	}

	/**
    |--------------------------------------------------
    | Private Background Worker Methods
    |--------------------------------------------------
    */

	async #identifyPII(pageText: string, pagePath: string) {
		print.log(`Scanning ${pagePath}`, "#228B22")
		const { result } = await sendToBackground({
			name: "pii/identify",
			body: { pageText }
		})

		return result.domItems
	}

	async #generateSelectors(domTree: string, domItems: Array<object>) {
		print.log(`Refining Selectors`, "#228B22")
		const { result } = await sendToBackground({
			name: "pii/generate",
			body: { domTree, domItems }
		})

		return result.domItems
	}

	/**
    |--------------------------------------------------
    | Public Methods
    |--------------------------------------------------
    */

	clearCache() {
		this.cache = {}
		localStorage.removeItem("config.ai")
	}

	scanPageForPII() {
		let pagePath = window.location.origin + window.location.pathname
		if (this.isOn && !this.cache[pagePath]) {
			setTimeout(async () => {
				let pageText = document.querySelector("body").innerText
				let domItems = await this.#identifyPII(pageText, pagePath)
				if (domItems.length > 0) {
					this.#findNodesWithPII(domItems)
					domItems = domItems.filter((item) => !item.delete)

					let domTree = this.#pruneAndSerializeDOM(
						document.body,
						domItems
					)

					domItems = await this.#generateSelectors(domTree, domItems)
				}
				domItems = this.#findInputFields(domItems)
				this.#highlightNodesWithPII(domItems)
				this.#saveToCache(domItems, pagePath, "domItems")
			}, 3000)
		} else if (this.isOn) {
			setTimeout(async () => {
				let domItems = this.cache[pagePath].domItems
				print.table(domItems)
				this.#highlightNodesWithPII(domItems)
			}, 3000)
		}
	}
}

export default ConfigAi
