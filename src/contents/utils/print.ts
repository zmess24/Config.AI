import { print } from "./print"

/**
|--------------------------------------------------
| Console Logs
|--------------------------------------------------
*/
const LOG_PREFIX = "[Config.AI]"

function log(text: string, color: string = "#000000") {
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

export const print = { log, table }
