export function log(text: string) {
	const LOG_PREFIX = "[Config.AI]"
	console.log(`%c ${LOG_PREFIX} ${text}`, `color: #000000; font-weight: bold`)
}
