// import { log } from "console"
import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"
import { useMessage } from "@plasmohq/messaging/hook"

/**
|--------------------------------------------------
| Console Logs
|--------------------------------------------------
*/

export function log(text: string, color: string = "#000000") {
	const LOG_PREFIX = "[Config.AI]"
	console.log(`${LOG_PREFIX} %c${text}`, `color: ${color}; font-weight: bold`)
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

		log(
			`Identifying PII for ${window.location.origin + window.location.pathname}`,
			"#228B22"
		)
		const resp = await sendToBackground({
			name: "pii/identify",
			body: { pageText }
		})

		log(JSON.stringify(resp))
	}
}

main()
