// import { log } from "console"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"
import { sendToBackground } from "@plasmohq/messaging"

/**
|--------------------------------------------------
| Console Logs
|--------------------------------------------------
*/

export function log(text: string) {
	const LOG_PREFIX = "[Config.AI]"
	console.log(`%c ${LOG_PREFIX} ${text}`, `color: #000000; font-weight: bold`)
}

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

async function main() {
	log("Content Script loaded.")
	const resp = await sendToBackground({
		name: "ping",
		body: {
			id: 123
		}
	})

	log(JSON.stringify(resp))
}

main()

function bfs(node) {
	const queue = [node]
	const results = []
	const excludeList = [
		"P",
		"LABEL",
		"BUTTON",
		"H1",
		"H2",
		"H3",
		"H4",
		"H5",
		"H6",
		"STRONG",
		"A"
	]
	while (queue.length > 0) {
		const current = queue.shift()

		if (current.children.length > 0) {
			for (let i = 0; i < current.children.length; i++) {
				if (!excludeList.includes(current.children[i].tagName)) {
					queue.push(current.children[i])
				}
			}
		} else {
			if (current.textContent) {
				results.push(current.textContent)
			}
		}
	}

	return results
}

bfs(document.body)

// function findPII(node, piiData, path = "") {
// 	let excludeTags = ["SCRIPT", "STYLE", "IFRAME", "CANVAS", "IMG"]
// 	if (
// 		node.children &&
// 		node.children.length === 0 &&
// 		node.textContent &&
// 		!excludeTags.includes(node.tagName)
// 	) {
// 		// Text node
// 		const text = node.textContent
// 		piiData.forEach(({ value }) => {
// 			const matches = text.includes(value)
// 			if (matches) {
// 				console.log(
// 					`Found PII at ${path} > ${node.tagName} for ${value}`
// 				)
// 			}
// 		})
// 	} else {
// 		// let parsedNode = createNodeString(node);
// 		// path.push(parsedNode);
// 		const newPath = path + " > " + node.tagName
// 		node.childNodes.forEach((child) => findPII(child, piiData, newPath))
// 	}
// }

// // let pageText = document.querySelector("body").textContent
// // console.log("PAGE TEXT", pageText)

// export const config: PlasmoCSConfig = {
// 	matches: ["<all_urls>"],
// 	world: "MAIN"
// }
