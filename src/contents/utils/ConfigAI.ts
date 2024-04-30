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
	cache: object

	constructor(provider: string, isOn: boolean) {
		this.provider = provider
		this.isOn = isOn
		this.cache = JSON.parse(
			window.localStorage.getItem("config.ai") || "{}"
		)
		this.nonTextBasedSelectors =
			"script, style, img, noscript, iframe, video, audio, canvas, meta, svg, path"

		print.log(
			`Provider: ${this.provider} | Session: ${this.isOn}`,
			"#3f51b5"
		)
	}

	/**
    |--------------------------------------------------
    | Private Methods
    |--------------------------------------------------
    */

	#createTreeWalker(nodeFilter) {
		return document.createTreeWalker(document.body, nodeFilter, null)
	}

	#constructSelector(node, depth = 0, selector = "") {
		// Base case: if we've reached the 6th parent or we don't have a parent node, return the accumulated selector
		if (depth === 6 || !node.parentNode) return selector.trim()
		// If the node has an ID, prepend it using the ID selector syntax and terminate the recursion
		if (node.id) return `#${node.id} ${selector}`.trim()
		// If the node has class names, prepend them using the class selector syntax
		let currentSelector = node.className
			? `.${node.className.split(" ").join(".")}`
			: "element" // Use 'element' as a placeholder if no class
		// Add the current selector to the accumulated selector
		selector = `${currentSelector} ${selector}`.trim()
		return this.#constructSelector(node.parentNode, depth + 1, selector)
	}

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
    | Public Methods
    |--------------------------------------------------
    */

	clearCache() {
		this.cache = {}
		localStorage.removeItem("config.ai")
	}

	scanPageForPII() {
		if (this.isOn) {
			print.log("Scanning page for PII")
			// setTimeout(async () => {
			// 	let pageText = document.querySelector("body").innerText
			// 	let pagePath = window.location.origin + window.location.pathname

			// 	print.log(`Identifying PII for ${pagePath}`, "#228B22")

			// 	const { result } = await sendToBackground({
			// 		name: "pii/identify",
			// 		body: { pageText }
			// 	})

			// 	this.findNodesWithPII(result.domItems)
			// 	this.#saveToCache(result.domItems, pagePath, "domItems")
			// }, 3000)
		}
	}

	findNodesWithPII(piiList) {
		const textNodes = []
		const walker = this.#createTreeWalker(NodeFilter.SHOW_TEXT)
		let node

		while ((node = walker.nextNode())) {
			piiList.forEach((data) => {
				if (
					node.textContent.includes(data.value) &&
					node.parentNode.nodeName !== "SCRIPT"
				) {
					let selector = this.#constructSelector(
						node.parentNode,
						0,
						""
					)
					data.selector = selector
				}
			})
		}

		return textNodes
	}

	pruneAndSerializeDOM(rootElement: HtmlHTMLAttributes) {
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

		// Remove non-essential attributes from all elements
		clonedElement.querySelectorAll("*").forEach((el: HTMLElement) => {
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
}

export default ConfigAi
