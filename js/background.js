
var USE_MOCK_DATA = true

/*
 * Caches the result from server so when the user clicks our icon,
 *  we already have the nutrition labels.
 * 
 * The cache maps urls to objects containing the following properties:
 *  - ready: boolean
 *  - response: <server response>
 *  - callbacks: list of callbacks to be called when the response is ready
 * 
 * TODO: limit cache size (e.g. TTL)
 */
var cache = {}

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, (tab => {
        fetchNutritionLabels(tab.url);
    }));
});

//Tab switch and url change listener
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        // ignore events other than url change
        !changeInfo.url

        // ignore browser specific (settings/history/etc) pages
        || changeInfo.url.startsWith('chrome://')
    ) return;

    fetchNutritionLabels(changeInfo.url);
});

/*
 * changeInfo.url is defined iff the tab's URL has changed.
 * 
 * 
 */
function fetchNutritionLabels(url, callback=null) {
    // if response is not cached, query the server
    if (cache[url] == null) {
        if (USE_MOCK_DATA) {
            cache[url] = {ready: true, response: MOCK_DATA};
            if (callback != null) {
                callback(MOCK_DATA);
            }
        } else {
            (function() {
                var cached = {ready: false, callbacks: []}
                cache[url] = cached;
                if (callback != null) {
                    cached.callbacks.push(callback);
                }
    
                console.log('querying for ' + url);
                http_params = {url: url};
                $.get( "http://localhost:8081/nutrition", http_params, response => {
                    console.log('cached ' + url);
                    console.log(cached);
                    cached.response = response;
                    cached.ready = true;
                    cached.callbacks.forEach(c => c(response));
                });
            })();
        }
    }
}

function getNutritionLabels(url, callback) {
    var cached = cache[url]
    if (cached && cached.ready) {
        // use cached response
        console.log(cached.response);
        callback(cached.response);
    } else if (cached && !cached.ready) {
        // we are already querying the server
        cached.callbacks.push(callback);
    } else {
        // if the website does not exist in the cache, query the server
        fetchNutritionLabels(url, callback);
    }
}

/*
 * If USE_MOCK_DATA is set to true, the following nutrition labels
 * will be used instead of fetching from the server.
 */
var MOCK_LOADING_TIME = 1000 // milliseconds
var MOCK_DATA = {
    "nutrition": [
        {
            "name": "effort",
            "display": "effort",
            "value": 50,
            "percentage": 100,
            "color": "#f00"
        },
        {
            "name": "topicality",
            "display": "topicality",
            "value": 40,
            "percentage": 75,
            "color": "#fc0"
        },
        {
            "name": "factuality",
            "display": "factuality",
            "value": 30,
            "percentage": 50,
            "color": "#0f0"
        },
        {
            "name": "emotion",
            "display": "emotion",
            "value": 20,
            "percentage": 25,
            "color": "#0cc"
        },
        {
            "name": "authority",
            "display": "authority",
            "value": 10,
            "percentage": 0,
            "color": "#00f"
        }
    ]
};