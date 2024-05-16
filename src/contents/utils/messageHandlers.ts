/**
|--------------------------------------------------
| Message Types
|--------------------------------------------------
*/

import { config } from "process"

export const MESSAGE_TYPES = {
	SESSION: {
		START: "session/startSession",
		END: "session/endSession",
		RESET: "session/resetSession",
		START_DOM_LISTENER: "session/startDomListener",
		END_DOM_LISTENER: "session/endDomListener"
	},
	MODEL: {
		CONNECTED: "models/modelAuthenticate/fulfilled",
		DISCONNECTED: "models/disconnectProvider"
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
			configAi.setPagePath()
			configAi.toggleDomListener(false)
			configAi.scanPageForPII()
		}
	})

	// Chrome Message Handler
	chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
		switch (message.body.type) {
			case MESSAGE_TYPES.MODEL.CONNECTED:
				configAi.setProvider(message.body.payload.provider)
				break
			case MESSAGE_TYPES.MODEL.DISCONNECTED:
				configAi.setProvider(undefined)
				break
			case MESSAGE_TYPES.SESSION.START:
				configAi.setIsOn(true)
				configAi.scanPageForPII()
				break
			case MESSAGE_TYPES.SESSION.END:
				configAi.setIsOn(false)
				configAi.toggleDomListener(false)
				break
			case MESSAGE_TYPES.SESSION.RESET:
				configAi.setCache("clear")
				break
			case MESSAGE_TYPES.SESSION.START_DOM_LISTENER:
				configAi.toggleDomListener(true)
				break
			case MESSAGE_TYPES.SESSION.END_DOM_LISTENER:
				configAi.toggleDomListener(false)
				break
			case "piiStatus":
				break
			case "popupOpened":
				sendResponse({ recordedPages: configAi.cache, host: configAi.host })
				break
			default:
				break
		}
	})
}
