import { print } from "./print"

/**
|--------------------------------------------------
| LocalStorage Handler
|--------------------------------------------------
*/

function saveDomItems(payload, url) {
	print.table(payload)
	let cache = JSON.parse(window.localStorage.getItem("config.ai") || "{}")

	if (cache[url]) {
		cache[url].domItems = [...cache[url].domItems, ...payload]
	} else {
		cache[url] = { domItems: [...payload], apiItems: [] }
	}

	localStorage.setItem("config.ai", JSON.stringify(cache))
}

function saveApiItems(payload, url) {
	print.table(payload)
	let cache = JSON.parse(window.localStorage.getItem("config.ai") || "{}")

	if (cache[url]) {
		cache[url].apiItems = [...cache[url].apiItems, ...payload]
	} else {
		cache[url] = { domItems: [], apiItems: [...payload] }
	}

	localStorage.setItem("config.ai", JSON.stringify(cache))
}

export const cache = {
	saveDomItems,
	saveApiItems
}
