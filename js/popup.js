$(document).ready(function () {

    //First set height!
    setHeight()

    //BEGIN Section: Selctors

    $('.flip-container').click(function () {
        flipCard();
    });

    $('#flipButton').click(function () {
        flipAllCards();
    });

    function test () {
        console.log("yes");
    }

    //load imprint when clicking on the "i"
    $('#imprint').click(function() {
        // $('html').load('imprint.html');
        window.location.href = "imprint.html";
    });

    //go back to landing page
    $('#back-arrow').click(function() {
        window.location.href = "popup.html";
    });


    //END Section: Selectors


    //BEGIN Section: Methods

    function setHeight() {
        var frontHeight = $('.front').outerHeight();
        var backHeight = $('.back').outerHeight();

        if (frontHeight > backHeight) {
            $('.flip-container, .card, .back').height(frontHeight);
        }
        else if (frontHeight > backHeight) {
            $('.flip-container, .card, .front').height(backHeight);
        }
        else {
            $('.flip-container, .card, .front').height(backHeight);
        }
    }

    function flipCard() {
        $('.card').flip({
            //some optional stuff for flipping animation
            axis: 'x',
            //trigger: 'hover',
            speed:200});
    }

    function flipAllCards() {
        //should do flipping and unflipping of all cards
        let cards = document.getElementsByClassName("card");


        // $('.card').each(function () {
        //     console.log(this);
        //     $('.card').flip({
        //         //some optional stuff for flipping animation
        //         axis: 'x',
        //         //trigger: 'hover',
        //         speed:200})
        // });

        for (i = 0; i < cards.length; i++){
            cards[i].flip(true);


            /*$('.card').flip({
            //some optional stuff for flipping animation
            axis: 'x',
            //trigger: 'hover',
            speed:200,
            });
            //flipCard(card);

            //$(cards[i]).flip({
             //   //some optional stuff for flipping animation
               // axis: 'x',
                //trigger: 'hover',
                //speed:200});*/
        }
    }

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
                $('#card_' + col.name + ' .back').append(`
                <div class="nutrition-bar" id="bar_${col.name}" tabindex="0">
                    <div class="nutrition-track">
                        <div class="nutrition-fill" id="fill_${col.name}">
                            <span id="bar_value">${Math.round(col.value)}</span>
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
                "background": '#3a4b8b'
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

    //END Section: Methods


// get the URL currently opened tab
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        var http_params = {
            "url": url
        };

        var bg = chrome.extension.getBackgroundPage();
        bg.getNutritionLabels(url, updateUi);
    });



});

