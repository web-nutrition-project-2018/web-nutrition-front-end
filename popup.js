
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
            //var data = {"url": "https://stackoverflow.com/questions/4630704/receiving-fatal-not-a-git-repository-when-attempting-to-remote-add-a-git-repo", "nutrition": [{"name": "readability", "display": "readability: 61%", "value": 61.26, "percentage": 61.26, "color": "#f00"}, {"name": "flesch_kincaid_grade", "display": "flesch kincaid grade: 9", "value": 9.3, "percentage": 53.49999999999999, "color": "#fc0"}, {"name": "dale_chall_readability_score", "display": "dale chall readability: 8", "value": 7.83, "percentage": 34.75, "color": "#0f0"}, {"name": "linsear_write_formula", "display": "linsear write formula: 8", "value": 8.333333333333334, "percentage": 58.33333333333333, "color": "#0cc"}, {"name": "gunning_fog", "display": "gunning fog: 18", "value": 17.676831683168317, "percentage": 41.07722772277228, "color": "#00f"}]};

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
