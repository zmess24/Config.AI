import { sendToBackground } from "@plasmohq/messaging"
import { print } from "./print"

/**
|--------------------------------------------------
| Message Handlers
|--------------------------------------------------
*/

export function initMessageHandlers(configAi) {
	chrome.runtime.onMessage.addListener(
		function (message, sender, sendResponse) {
			switch (message.name) {
				case "providerConnected":
					print.log(
						`Connected to Provider: ${message.body}`,
						"#228B22"
					)
					break
				case "providerDisconnected":
					print.log(`Disconnected from Provider`, "#850101")
					break
				case "startSession":
					print.log(`Starting Session`, "#228B22")
					configAi.scanPageForPII()
					break
				case "endSession":
					print.log(`Ending Session`, "#850101")
					break
				case "resetSession":
					configAi.clearCache()
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
					sendResponse({ recordedPages: configAi.cache })
					break
				default:
					break
			}
		}
	)

	window.addEventListener("message", (event) => {
		if (event.source === window) {
			switch (event.data.type) {
				case "routeChange":
					configAi.scanPageForPII()
					break
				default:
					break
			}
		}
	})
}
