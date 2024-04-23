import type { PlasmoCSConfig } from "plasmo"
import { log } from "~core/console"
import { persistor, store } from "~core/store"

persistor.subscribe(() => {
	const modelState = store.getState().models
	console.log("MODEL STATE", modelState)
	log(
		`Loaded. ${modelState.provider ? `Connected to ${modelState.provider}` : `Disconnected`}`
	)
})

function getAllTextNodes() {
	const allTextNodes = []
	const walkTheDOM = (node, func) => {
		func(node)
		node = node.firstChild
		while (node) {
			walkTheDOM(node, func)
			node = node.nextSibling
		}
	}

	walkTheDOM(document.body, function (node) {
		const excludeTags = ["SCRIPT", "STYLE", "IFRAME", "CANVAS"]
		if (
			node.nodeType === 3 &&
			!excludeTags.includes(node.parentNode.tagName)
		) {
			allTextNodes.push(node.nodeValue.trim())
		}
	})

	let filtered = allTextNodes.filter((text) => text.length > 0) // Filter out empty strings
	return JSON.stringify(filtered)
}

function findPII(node, piiData, path = "") {
	let excludeTags = ["SCRIPT", "STYLE", "IFRAME", "CANVAS", "IMG"]
	if (
		node.children &&
		node.children.length === 0 &&
		node.textContent &&
		!excludeTags.includes(node.tagName)
	) {
		// Text node
		const text = node.textContent
		piiData.forEach(({ value }) => {
			const matches = text.includes(value)
			if (matches) {
				console.log(
					`Found PII at ${path} > ${node.tagName} for ${value}`
				)
			}
		})
	} else {
		// let parsedNode = createNodeString(node);
		// path.push(parsedNode);
		const newPath = path + " > " + node.tagName
		node.childNodes.forEach((child) => findPII(child, piiData, newPath))
	}
}

// log("Identifying PII/PCI")
// setTimeout(() => {
// 	const pageText = getAllTextNodes()
// 	store.dispatch(
// 		modelIdentifyPii({
// 			pageText,

// 		})
// 	)
// }, 3000)

// let pageText = document.querySelector("body").textContent
// console.log("PAGE TEXT", pageText)

export const config: PlasmoCSConfig = {
	matches: ["<all_urls>"],
	world: "MAIN"
}
