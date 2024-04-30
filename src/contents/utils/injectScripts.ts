function injectRouteHandlerScript() {
	const script = document.createElement("script")
	script.src = chrome.runtime.getURL("scripts/routeHandlerScript.js")
	;(document.head || document.documentElement).appendChild(script)
}

export default injectRouteHandlerScript
