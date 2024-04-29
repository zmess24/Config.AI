// import { log } from "console"
import type { PlasmoCSConfig } from "plasmo"
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
	if (node.id) {
		return `${node.id} ${selector}`
	} else {
		let attribute = node.className
		if (depth === 6) {
			return selector
		} else {
			selector = `${attribute} ${selector}`
			return constructSelector(node.parentNode, depth + 1, selector)
		}
	}
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
