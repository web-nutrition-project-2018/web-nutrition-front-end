
// this function is executed everytime the user clicks on the extension icon (opening the popup)
$(function(){
    console.log('popup.js');

    // get the URL currently opened tab
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        var http_params = {
            "url": url
        };
        $.get( "http://localhost:8081/nutrition", http_params, function( data ) {
            // mock object (for testing, if server is not available)
            /*var chartData = [
                {
                    "name": "effort",
                    "display": "effort",
                    "value": 85,
                    "color": "#f00"
                },
                {
                    "name": "topicality",
                    "display": "topicality",
                    "value": 25,
                    "color": "#fc0"
                },
                {
                    "name": "factuality",
                    "display": "factuality",
                    "value": 75,
                    "color": "#0f0"
                },
                {
                    "name": "emotion",
                    "display": "emotion",
                    "value": 95,
                    "color": "#0cc"
                },
                {
                    "name": "authority",
                    "display": "authority",
                    "value": 12,
                    "color": "#00f"
                }
            ];*/

            console.log(data);

            // actual code updating the UI
            $('#nutrition_loading').hide();
            if (data.error != null) {
                $('#nutrition_explanation').text(data.error);
            } else {
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
                    
                    $('#fill_' + col.name).css({
                        "height": col.percentage + "%",
                        "top": (100 - col.percentage) + "%",
                        "background": col.color
                    });

                    $('#bar_' + col.name).hover(e => { updateExplanation(col.display); });
                    $('#bar_' + col.name).click(e => { updateExplanation(col.display); });
                });
            }
        });
    });
});

function updateExplanation(text) {
    $('#nutrition_explanation').text(text);
}
