
// this function is executed everytime the user clicks on the extension icon (opening the popup)
$(function(){
    console.log('popup.js');

    // get the URL currently opened tab
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        //$.get( "http://www.this.should.be.our.server.address.com", http_params, function( data ) {
            // mock object (since server is not implemented)
            var chartData = [
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
            ];

            // actual code updating the UI
            chartData.forEach(col => {
                $('#nutrition_chart').append(`
                    <div class="nutrition-bar" id="bar_${col.name}" tabindex="0">
                        <div class="nutrition-track">
                            <div class="nutrition-fill" id="fill_${col.name}">
                                <span>${col.value}</span>
                            </div>
                        </div>
                    </div>
                `);
                
                $('#fill_' + col.name).css({
                    "height": col.value + "%",
                    "top": (100 - col.value) + "%",
                    "background": col.color
                });

                $('#bar_' + col.name).hover(e => { updateExplanation(col); });
                $('#bar_' + col.name).click(e => { updateExplanation(col); });
            });
        //});
    });
});

function updateExplanation(col) {
    $('#nutrition_explanation').text(col.name + ': ' + col.value + '%');
}
