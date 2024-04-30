/**
|--------------------------------------------------
| Console Logs
|--------------------------------------------------
*/

const LOG_PREFIX = "[Config.AI]"

const RATING_COLORS = {
	black: "#000000",
	good: "#228B22",
	low: "#FFD700",
	medium: "#FFA500",
	high: "#FF4E42"
}

function log(text: string, color: string = RATING_COLORS.black) {
	console.log(`${LOG_PREFIX} %c${text}`, `color: ${color}; font-weight: bold`)
}

function table(piiElements) {
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
