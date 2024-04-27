function injectScript(code) {
	console.log("Injecting Script")

	// Create a new script element
	const script = document.createElement("script")

	// Set the JavaScript code as the text of the script element
	script.textContent = code // Use textContent for inline script

	// Optionally set an id for the script element (useful for identification or removal)
	script.id = "config-ai-script"

	// Append the script element to the head or the documentElement
	;(document.head || document.documentElement).appendChild(script)

	console.log("Finished Injecting Script")
}

// The actual JavaScript code you want to inject
const code = `
    console.log("Injected Script Loaded");
    (function(history){
        console.log("History API Hooked");
        var pushState = history.pushState;
        var replaceState = history.replaceState;

        history.pushState = function(state) {
            console.log('pushState called', state);
            if (typeof history.onpushstate == "function") {
                history.onpushstate({state: state});
            }
            return pushState.apply(history, arguments);
        };

        history.replaceState = function(state) {
            console.log('replaceState called', state);
            if (typeof history.onreplacestate == "function") {
                history.onreplacestate({state: state});
            }
            return replaceState.apply(history, arguments);
        };

        window.addEventListener('popstate', function(event) {
            console.log('Location changed!');
        });
    })(window.history);
`

// Call the function to inject the script
injectScript(code)
