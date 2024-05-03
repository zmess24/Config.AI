/**
|--------------------------------------------------
| Console Logs
|--------------------------------------------------
*/

const LOG_PREFIX = "[Config.AI]"

const RATING_COLORS = {
	black: "#000000",
	green: "#228B22",
	yellow: "#FFD700",
	orange: "#FFA500",
	red: "#FF4E42"
}

function log(text: string, color: string = RATING_COLORS.black) {
	console.log(`${LOG_PREFIX} %c${text}`, `color: ${color}; font-weight: bold`)
}

function table(text: string, items) {
	// Log to console
	console.groupCollapsed(
		`${LOG_PREFIX}:  ${text}: %c${items.length} Elements Found`,
		`color: #FF4E42`
	)
	console.log("Page PII Found:")
	console.table(items)
	console.groupEnd()
}

export const print = { log, table }
