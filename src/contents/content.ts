import styleText from "data-text:./styles/overlay.css"
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
| Inject Stylesheet
|--------------------------------------------------
*/

function injectCSS() {
	const style = document.createElement("style")
	style.id = "config-ai"
	style.textContent = styleText
	document.head.appendChild(style)
}

/**
|--------------------------------------------------
| Main Script
|--------------------------------------------------
*/

async function main() {
	print.log("Content Script Loaded.")
	// Inject stylesheet
	injectCSS()
	// Fetch the current state of the extension
	let { isOn, provider, host } = await sendToBackground({ name: "initState" })
	// Init Config.AI class
	const configAi = new ConfigAi(provider, isOn, host)
	// Initialize the Message Listeners
	initMessageHandlers(configAi)
	// configAi.toggleDomListener(false)
	// Scan the page for PII
	configAi.scanPageForPII()
}

main()
