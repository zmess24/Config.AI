// import { log } from "console"
import type { PlasmoCSConfig } from "plasmo"
import { sendToBackground } from "@plasmohq/messaging"
import ConfigAi from "./utils/ConfigAI"
import injectRouteHandlerScript from "./utils/injectScripts"
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
	// print.log(`Provider: ${provider}, isOn: ${isOn}`, "#228B22")
	const configAi = new ConfigAi(provider, isOn)
	// Inject the Route Handler Script
	injectRouteHandlerScript()
	// Initialize the Message Listeners
	initMessageHandlers(configAi)
	// Scan the page for PII
	configAi.scanPageForPII()
}

main()
