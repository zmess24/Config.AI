import { STATE_TYPES } from "~core/store/stateTypes"
import { print } from "./print"

/**
|--------------------------------------------------
| Message Handlers
|--------------------------------------------------
*/

export function initMessageHandlers(configAi) {
	// Inject Route Handler Script
	const script = document.createElement("script")
	script.src = chrome.runtime.getURL("scripts/routeHandlerScript.js")
	;(document.head || document.documentElement).appendChild(script)

	// Window Message Handler
	window.addEventListener("message", (event) => {
		if (event.source === window && event.data.type === "routeChange") {
			configAi.scanPageForPII()
		}
	})

	// Chrome Message Handler
	chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
		switch (message.body.type) {
			case "providerConnected":
				print.log(`Connected to Provider: ${message.body}`, "#228B22")
				break
			case "providerDisconnected":
				print.log(`Disconnected from Provider`, "#850101")
				break
			case STATE_TYPES.SESSION.START:
				configAi.setIsOn(true)
				configAi.scanPageForPII()
				break
			case STATE_TYPES.SESSION.END:
				configAi.setIsOn(false)
				break
			case STATE_TYPES.SESSION.RESET:
				configAi.setCache("clear")
				break
			case "piiStatus":
				print.log(`PII Remediation Status: ${message.body.status}`, "#850101")
				break
			case "popupOpened":
				print.log("Popup Opened")
				sendResponse({ recordedPages: configAi.cache })
				break
			default:
				break
		}
	})
}
