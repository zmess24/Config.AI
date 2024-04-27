console.log("Injected Script Loaded")
function injectScript(code) {
	conso.log("Injecting Script")
	const script = document.createElement("script")
	script.text = code
	script.src = chrome.runtime.getURL("scripts/injectedScript.js")
	script.id = "config-ai-script"(
		document.head || document.documentElement
	).appendChild(script)
	conso.log("Finished Injecting Script")
}

// The script you want to inject
const code = `
    console.log("Injected Script Loaded");
    (function(history){
    console.log("History API Hooked")
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
