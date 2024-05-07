import { finder } from "@medv/finder"
import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"
import ConfigAi from "./utils/ConfigAI"
import { initMessageHandlers } from "./utils/messageHandlers"
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

async function main() {
	print.log("Content Script Loaded.")
	// Fetch the current state of the extension
	let { isOn, provider } = await sendToBackground({ name: "initState" })
	// Init Config.AI class
	const configAi = new ConfigAi(provider, isOn)
	// Initialize the Message Listeners
	initMessageHandlers(configAi)
	// Scan the page for PII
	configAi.scanPageForPII()
	// Inject CSS sheet
	configAi.injectCSS()

	document.addEventListener("click", function (event: any) {
		event.preventDefault()
		const selector = finder(event.target)
		console.log("TEST: ", selector, event.target.innerText)
	})
}

main()
