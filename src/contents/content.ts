// import { log } from "console"
import type { PlasmoCSConfig } from "plasmo"
import type { HtmlHTMLAttributes } from "react"
import { sendToBackground } from "@plasmohq/messaging"
import { cache } from "./utils/cache"
import { print } from "./utils/print"

/**
|--------------------------------------------------
| Plasmo Config
|--------------------------------------------------
*/

export const config: PlasmoCSConfig = {
	matches: ["<all_urls>"]
}

/**
|--------------------------------------------------
| Main Script
|--------------------------------------------------
*/

function constructSelector(node, depth = 0, selector = "") {
	// Base case: if we've reached the 6th parent or we don't have a parent node, return the accumulated selector
	if (depth === 6 || !node.parentNode) {
		return selector.trim() // Remove trailing spaces
	}

	// If the node has an ID, prepend it using the ID selector syntax and terminate the recursion
	if (node.id) {
		return `#${node.id} ${selector}`.trim()
	}

	// If the node has class names, prepend them using the class selector syntax
	let currentSelector = node.className
		? `.${node.className.split(" ").join(".")}`
		: "element" // Use 'element' as a placeholder if no class
	selector = `${currentSelector} ${selector}`.trim() // Add the current selector to the accumulated selector

	// Recursively call the function with the parent node, increasing the depth
	return constructSelector(node.parentNode, depth + 1, selector)
}

function findNodesWithPII(piiList) {
	const textNodes = []
	const walker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT,
		null
	)

	let node
	while ((node = walker.nextNode())) {
		// Check if the text content of the node contains any PII/PCI
		piiList.forEach((data) => {
			if (
				node.textContent.includes(data.value) &&
				// !data.selector &&
				node.parentNode.nodeName !== "SCRIPT"
			) {
				let selector = constructSelector(node.parentNode, 0, "")
				debugger
				data.selector = selector
			}
		})
	}

	return textNodes
}

async function main() {
	print.log("Content Script Loaded.")
	let { isOn, provider } = await sendToBackground({ name: "initState" })
	print.log(`Provider: ${provider} | Session: ${isOn}`, "#3f51b5")

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		switch (message.name) {
			case "providerConnected":
				print.log(`Connected to Provider: ${message.body}`, "#228B22")
				break
			case "providerDisconnected":
				print.log(`Disconnected from Provider`, "#850101")
				break
			case "startSession":
				print.log(`Starting Session`, "#228B22")
				break
			case "endSession":
				print.log(`Ending Session`, "#850101")
				break
			case "resetSession":
				window.localStorage.removeItem("config.ai")
				print.log("Resetting Session")
				break
			case "piiStatus":
				print.log(
					`PII Remediation Status: ${message.body.status}`,
					"#850101"
				)
				break
			case "popupOpened":
				print.log("Popup Opened")
				let recordedPages = JSON.parse(
					window.localStorage.getItem("config.ai")
				)
				sendResponse({ recordedPages })
				break
			default:
				break
		}
	})

	function injectScript() {
		const script = document.createElement("script")
		script.src = chrome.runtime.getURL("scripts/routeHandlerScript.js")
		;(document.head || document.documentElement).appendChild(script)
	}

	window.addEventListener("message", (event) => {
		if (event.source === window && event.data.type === "routeChange") {
			if (isOn) {
				setTimeout(async () => {
					let pageText = document.querySelector("body").innerText
					let pagePath =
						window.location.origin + window.location.pathname

					print.log(`Identifying PII for ${pagePath}`, "#228B22")

					const { result } = await sendToBackground({
						name: "pii/identify",
						body: { pageText }
					})

					console.log(result)

					// cache.saveDomItems(result.domItems, pagePath)
				}, 3000)
			}
		}
	})

	injectScript()

	if (isOn) {
		setTimeout(async () => {
			let pageText = document.querySelector("body").innerText
			let pagePath = window.location.origin + window.location.pathname

			print.log(`Identifying PII for ${pagePath}`, "#228B22")

			const { result } = await sendToBackground({
				name: "pii/identify",
				body: { pageText }
			})

			findNodesWithPII(result.domItems)
			cache.saveDomItems(result.domItems, pagePath)
		}, 3000)
	}
}

main()

// Example usage:
let storage = JSON.parse(window.localStorage.getItem("config.ai"))
let pagePII = storage["https://skims.com/account"]
let piiList = pagePII.domItems
const nodesContainingPII = findNodesWithPII(piiList)
console.log(nodesContainingPII) // Logs all nodes containing specified PII/PCI

function pruneAndSerializeDOM(rootElement) {
	// Create a deep clone of the rootElement to work on
	const clonedElement = rootElement.cloneNode(true)

	// Define the selector to match non-text-based elements
	const nonTextBasedSelectors =
		"script, style, img, noscript, iframe, video, audio, canvas, meta, svg, path"

	// Find all elements matching the selectors within the clonedElement
	const nonTextBasedElements = clonedElement.querySelectorAll(
		nonTextBasedSelectors
	)

	// Convert NodeList to array to manipulate the DOM safely while iterating
	const elementsArray = Array.from(nonTextBasedElements)

	// Remove each non-text-based element from the DOM
	elementsArray.forEach((element) => element.parentNode.removeChild(element))

	// Additionally, remove all style attributes from all elements
	const allElements = clonedElement.querySelectorAll("*")

	// Remove non-essential attributes from all elements
	allElements.forEach((el) => {
		// Get an array of attribute names to consider for removal
		const attributes = Array.from(el.attributes)
		attributes.forEach((attr: HtmlHTMLAttributes) => {
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

	// Remove all comment nodes
	const walker = document.createTreeWalker(
		clonedElement,
		NodeFilter.SHOW_COMMENT,
		null
	)
	let currentNode = walker.nextNode()
	while (currentNode) {
		currentNode.parentNode.removeChild(currentNode)
		currentNode = walker.nextNode()
	}

	// Serialize the pruned DOM tree to a string
	const serializer = new XMLSerializer()
	const serializedDOM = serializer.serializeToString(clonedElement)

	console.log(
		`Removed ${elementsArray.length} non-text-based nodes, all style attributes, and all comment nodes from the cloned DOM.`
	)
	return serializedDOM
}

// Usage example, typically you might call this on the document body or any specific container
const serializedContent = pruneAndSerializeDOM(document.body)
console.log(serializedContent)
