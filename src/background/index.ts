chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log("Message received in background:", message)

	if (message.greeting) {
		sendResponse({ farewell: "goodbye from background" })
	}

	return true // Return true to keep the message channel open for asynchronous responses
})
