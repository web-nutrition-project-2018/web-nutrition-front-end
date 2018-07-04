/**
 * Created by Clau on 18.06.2018.
 */

var USE_MOCK_DATA = true;

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
                setTimeout(function(){ callback(MOCK_DATA); }, 1000);
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
  "nutrition": {
    "objectivity": {
      "subfeatures": [
        
      ],
      "main_score": 79.7172619047619,
      "status": "ok"
    },
    "sentiment": {
      "subfeatures": [
        {
          "value": 0.4166666666666667,
          "percentage": 0.7045559766521665,
          "name": "Positive sentiment",
          "tooltip": "How much positivity found in the article's opinions",
          "status": "ok"
        },
        {
          "value": 6.50297619047619,
          "percentage": 2.114681011265161,
          "name": "Negative sentiment",
          "tooltip": "How much negativity found in the article's opinions",
          "status": "ok"
        }
      ],
      "main_score": 6.919642857142857,
      "status": "ok"
    },
    "source": {
      "subfeatures": [
        {
          "value": 94.0,
          "percentage": 94.0,
          "name": "Web of Trust Score",
          "status": "ok"
        },
        {
          "name": "Google Page Rank",
          "status": "error"
        },
        {
          "name": "CheckPageRank.net Score",
          "status": "error"
        },
        {
          "value": 38.920478657429754,
          "percentage": 38.920478657429754,
          "name": "Twitter followers",
          "status": "ok"
        },
        {
          "value": 58.51811790156842,
          "percentage": 58.51811790156842,
          "name": "Twitter listed count",
          "status": "ok"
        }
      ],
      "main_score": 94.0,
      "status": "ok"
    },
    "readability": {
      "status": "error"
    },
    "virality": {
      "subfeatures": [
        {
          "value": 0.05646045163106374,
          "percentage": 0.05646045163106374,
          "name": "Tweets per hour",
          "status": "ok"
        }
      ],
      "main_score": 0.5614346310277369,
      "status": "ok"
    }
  },
  "status": "ok",
  "url": "https://www.npr.org/2018/07/03/625603260/former-malaysian-prime-minister-arrested-amid-corruption-scandal"
};