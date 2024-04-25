// import { log } from "console"
import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"
import { useMessage } from "@plasmohq/messaging/hook"

/**
|--------------------------------------------------
| Console Logs
|--------------------------------------------------
*/
const LOG_PREFIX = "[Config.AI]"

export function log(text: string, color: string = "#000000") {
	console.log(`${LOG_PREFIX} %c${text}`, `color: ${color}; font-weight: bold`)
}

function table(piiElements) {
	const RATING_COLORS = {
		none: "#0CCE6A",
		low: "#FFD700",
		medium: "#FFA500",
		high: "#FF4E42"
	}

	// Log to console
	console.groupCollapsed(
		`${LOG_PREFIX}:  PII/PCI: %c${piiElements.length} Elements Found`,
		`color: #FF4E42`
	)
	console.log("Page PII Found:")
	console.table(piiElements)
	console.groupEnd()
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
	log("Content Script Loaded.")
	let { isOn, provider } = await sendToBackground({ name: "initState" })
	log(`Provider: ${provider} | Session: ${isOn}`, "#3f51b5")

	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		switch (message.name) {
			case "providerConnected":
				log(`Connected to Provider: ${message.body}`, "#228B22")
				break
			case "providerDisconnected":
				log(`Disconnected from Provider`, "#850101")
				break
			case "startSession":
				log(`Starting Session`, "#228B22")
				break
			case "endSession":
				log(`Ending Session`, "#850101")
				break
			case "piiStatus":
				log(`PII Remediation Status: ${message.body.status}`, "#850101")
				break
			default:
				break
		}
	})

	if (isOn) {
		let pageText =
			"first nameRogerlast nameMessingeremail addresszmessinger@quantummetric.compasswordsend reset emailWishlist"

		let pagePath = window.location.origin + window.location.pathname

		log(`Identifying PII for ${pagePath}`, "#228B22")

		const resp = await sendToBackground({
			name: "pii/identify",
			body: { pageText }
		})

		table(resp.result.entries)
	}
}

main()
