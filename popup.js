
var USE_MOCK_DATA = true

// this function is executed everytime the user clicks on the extension icon (opening the popup)
$(function(){
    console.log('popup.js');

    // get the URL currently opened tab
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        var http_params = {
            "url": url
        };

        if (USE_MOCK_DATA) {
            setTimeout(() => updateUi(MOCK_DATA), MOCK_LOADING_TIME)
        } else {
            $.get( "http://localhost:8081/nutrition", http_params, updateUi );
        }
    });
});

// Update UI based on nutrition data
function updateUi(data) {
    // hide loading animation
    $('#nutrition_loading').hide();


    if (data.error != null) {
        // show error
        $('#nutrition_explanation').text(data.error);
    } else {
        // for each nutrition label, create a bar chart
        data.nutrition.forEach(col => {
            $('#nutrition_chart').append(`
                <div class="nutrition-bar" id="bar_${col.name}" tabindex="0">
                    <div class="nutrition-track">
                        <div class="nutrition-fill" id="fill_${col.name}">
                            <span>${Math.round(col.value)}</span>
                        </div>
                    </div>
                </div>
            `);
            
            /*
             * position the bar in the bar chart so that it is on the bottom and growing upwards
             *  (otherwise the bar will be on the top, growing downwards)
             */
            $('#fill_' + col.name).css({
                "height": col.percentage + "%",
                "top": (100 - col.percentage) + "%",
                "background": col.color
            });

            // show extra information on hover and click (hover is useless on mobile phone)
            $('#bar_' + col.name).hover(e => { updateExplanation(col.display); });
            $('#bar_' + col.name).click(e => { updateExplanation(col.display); });
        });
    }
}

function updateExplanation(text) {
    $('#nutrition_explanation').text(text);
}

// If USE_MOCK_DATA is set to true, the following nutrition labels will be used instead of fetching from the server.
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