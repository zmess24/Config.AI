import { print } from "./print"

/**
|--------------------------------------------------
| Message Types
|--------------------------------------------------
*/

export const MESSAGE_TYPES = {
	SESSION: {
		START: "startSession",
		END: "endSession",
		RESET: "resetSession",
		START_DOM_LISTENER: "session/startDomListener",
		END_DOM_LISTENER: "session/endDomListener"
	},
	MODEL: {
		CONNECTED: "providerConnected",
		DISCONNECTED: "providerDisconnected"
	}
}

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
		print.log(JSON.stringify(message))
		if (message.body.type === "session/startDomListener") {
			configAi.toggleDomListener(true)
		}

		if (message.body.type === "session/endDomListener") {
			configAi.toggleDomListener(false)
		}

		switch (message.name) {
			case "providerConnected":
				print.log(`Connected to Provider: ${message.body}`, "#228B22")
				break
			case "providerDisconnected":
				print.log(`Disconnected from Provider`, "#850101")
				break
			case "startSession":
				print.log(`Starting Session`, "#228B22")
				configAi.setIsOn(true)
				configAi.scanPageForPII()
				break
			case "endSession":
				print.log(`Ending Session`, "#850101")
				configAi.setIsOn(false)
				break
			case "resetSession":
				configAi.setCache("clear")
				print.log("Resetting Session")
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
