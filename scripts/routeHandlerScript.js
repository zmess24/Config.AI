function injectScript(code) {
	// Create a new script element
	const script = document.createElement("script")

	// Set the JavaScript code as the text of the script element
	script.textContent = code // Use textContent for inline script

	// Optionally set an id for the script element (useful for identification or removal)
	script.id = "config-ai-script"

	// Append the script element to the head or the documentElement
	;(document.head || document.documentElement).appendChild(script)
}

// The actual JavaScript code you want to inject
const code = `
    (function(history){
        var pushState = history.pushState;
        var replaceState = history.replaceState;

        history.pushState = function(state) {
            window.postMessage({ type: 'routeChange' }, '*');
            if (typeof history.onpushstate == "function") {
                history.onpushstate({state: state});
            }
            return pushState.apply(history, arguments);
        };

        history.replaceState = function(state) {
            window.postMessage({ type: 'routeChange' }, '*');
            if (typeof history.onreplacestate == "function") {
                history.onreplacestate({state: state});
            }
            return replaceState.apply(history, arguments);
        };

        window.addEventListener('popstate', function(event) {
            window.postMessage({ type: 'routeChange' }, '*');
        });
    })(window.history);
`

// Call the function to inject the script
injectScript(code)
