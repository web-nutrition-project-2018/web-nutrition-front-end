$(document).ready(function () {

    //First set height!
    setHeight();

    //BEGIN Section: Selctors

    $('.flip-container').click(function () {
        flipCard();
    });

    $('#flipButton').click(function () {
        flipAllCards();
    });

    //load imprint when clicking on the "i"
    $('#imprint').click(function() {
        // $('html').load('imprint.html');
        window.location.href = "imprint.html";
    });

    //go back to landing page
    $('#back-arrow').click(function() {
        window.location.href = "popup.html";
    });

    //init loader animations
    $('.loader').append(`
        <div class="sk-cube-grid">
            <div class="sk-cube sk-cube1"></div>
            <div class="sk-cube sk-cube2"></div>
            <div class="sk-cube sk-cube3"></div>
            <div class="sk-cube sk-cube4"></div>
            <div class="sk-cube sk-cube5"></div>
            <div class="sk-cube sk-cube6"></div>
            <div class="sk-cube sk-cube7"></div>
            <div class="sk-cube sk-cube8"></div>
            <div class="sk-cube sk-cube9"></div>
        </div>
    `);

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
        var cards = document.getElementsByClassName("card");

        // $('.card').each(function () {
        //     console.log(this);
        //     $('.card').flip({
        //         //some optional stuff for flipping animation
        //         axis: 'x',
        //         //trigger: 'hover',
        //         speed:200})
        // });

        for (i = 0; i < cards.length; i++){
            $('cards[i]').flip({
                //some optional stuff for flipping animation
                axis: 'x',
                //trigger: 'hover',
                speed:200});
        }
    }

    // Update UI based on nutrition data
    function updateUi(data) {
        labels = ['influence', 'virality', 'readability', 'sentiment', 'objectivity']

        // hide loading animation
        $('.loader').remove();

        if (data.status != 'ok') {
            // show error
            labels.forEach(label => {
                markCardUnavailable(label);
            });
            $('#nutrition_explanation').text(data.error);
        } else {
            // for each nutrition label, create a bar chart
            labels.forEach(label => {
                let labelData = data.nutrition[label];
                let backSide = $('#card_' + label + ' .back');
                let mainScore = Math.round(labelData.main_score);

                if (labelData.status != 'ok') {
                    markCardUnavailable(label);
                } else {
                    backSide.append(createHBar(mainScore, mainScore + '%', ));
                    backSide.append('<div class="main-score-spacer"></div>');
                    
                    let first = true;
                    labelData.subfeatures.forEach(subfeature => {
                        if (!first) {
                            backSide.append('<div class="subfeature-spacer"></div>');
                        }
                        first = false;
    
                        let shortName = subfeature.name.length < 12
                            ? subfeature.name
                            : subfeature.name.substring(0, 10) + '..';
                        backSide.append(createHBar(subfeature.percentage, shortName + ': ' + Math.round(subfeature.value), subfeature.name));
                    });
                }
            });
        }
    }

    function markCardUnavailable(label) {
        let backSide = $('#card_' + label + ' .back');
        let frontSide = $('#card_' + label + ' .front');
        backSide.append('<div>unavailable</div>');
        backSide.addClass('unavailable');
        frontSide.addClass('unavailable');
    }

    function createHBar(percentage, text, tooltip) {
        let hbar = $(`
            <div class='hbar'
                 style='background: linear-gradient(to right, #3a4b8b ${percentage}% , #ccc ${percentage}%);'
                 title='${tooltip}'>
                ${text}
            </div>
        `);
        hbar.tooltip();
        return hbar;
    }

    //END Section: Methods


// get the URL currently opened tab
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        var bg = chrome.extension.getBackgroundPage();
        bg.getNutritionLabels(url, updateUi);
    });



});

