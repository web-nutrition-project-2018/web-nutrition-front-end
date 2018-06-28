/**
 * Created by Clau on 18.06.2018.
 */

var USE_MOCK_DATA = false;

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
                setTimeout(function(){ callback(MOCK_DATA); }, 3000);
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
    "url": "https://en.wikipedia.org/wiki/Chess",
    "nutrition": {
      "sentiment": {
        "subfeatures": [
          {
            "name": "Positive sentiment",
            "value": 8.37673951952889,
            "percentage": 8.37673951952889
          },
          {
            "name": "Negative sentiment",
            "value": 5.290179512665281,
            "percentage": 5.290179512665281
          }
        ],
        "main_score": 13.666919032194171,
        "status": "ok"
      },
      "virality": {
        "subfeatures": [
          {
            "name": "Tweets per hour",
            "value": 48.28743219561765,
            "percentage": 82.84364292041698
          }
        ],
        "main_score": 82.84364292041698,
        "status": "ok"
      },
      "influence": {
        "subfeatures": [
          {
            "name": "Web of Trust",
            "value": 94.0,
            "percentage": 94.0
          },
          {
            "name": "Alexa Rank",
            "value": 98.41605470367712,
            "percentage": 98.41605470367712
          },
          {
            "name": "Google Page Rank",
            "value": 80.0,
            "percentage": 80.0
          },
          {
            "name": "CheckPageRank.net Score",
            "value": 89.0,
            "percentage": 89.0
          },
          {
            "name": "Twitter followers",
            "value": 0.10040409882978961,
            "percentage": 0.10040409882978961
          },
          {
            "name": "Twitter friends",
            "value": 0.10040409882978961,
            "percentage": 0.10040409882978961
          },
          {
            "name": "Twitter listed",
            "value": 0.7330296921722262,
            "percentage": 0.7330296921722262
          }
        ],
        "main_score": 51.76427037050127,
        "status": "ok"
      },
      "objectivity": {
        "subfeatures": [
          
        ],
        "main_score": 68.6500570727326,
        "status": "ok"
      },
      "readability": {
        "subfeatures": [
          
        ],
        "main_score": 80.0,
        "status": "ok"
      }
    },
    "status": "ok"
  };