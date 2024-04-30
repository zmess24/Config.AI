import type { HtmlHTMLAttributes } from "react"

/**
|--------------------------------------------------
| DOM Manipultion Utlities
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

export const domUtils = { pruneAndSerializeDOM, findNodesWithPII }
