import { CardView } from "./cardView.js";

let cards = [
    {
        label: 'source',
        displayName: 'Source Popularity'
    }, {
        label: 'virality',
        displayName: 'Virality'
    }, {
        label: 'readability',
        displayName: 'Readability'
    }, {
        label: 'sentiment',
        displayName: 'Sentiment'
    }, {
        label: 'objectivity',
        displayName: 'Objectivity'
    }
]

let cardViews = [];

$(document).ready(function () {

    // create cards
    let mainLayout = $('#nutrition_layout');

    let rowSize = 3;
    let rowLayout = null;
    cards.forEach(card => {
        // create row layout every 3 labels
        rowSize++;
        if (rowSize >= 3) {
            rowLayout = $('<div class="row content"></div>');
            mainLayout.append(rowLayout);
            mainLayout.append($('<hr />'));
            rowSize = 0;
        }

        // create card layout
        card.view = new CardView(card);
        rowLayout.append(card.view.uiElement);
    });
    
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
        $('.loader').remove();

        if (data.status != 'ok') {
            cards.forEach(card => card.view.showError(data.error));
        } else {
            console.log('showing data...');
            console.log(cards);
            cards.forEach(card => console.log(card.view));
            cards.forEach(card => card.view.showData(data));
        }
    }

    //END Section: Methods


// get the URL currently opened tab
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        var bg = chrome.extension.getBackgroundPage();
        bg.getNutritionLabels(url, updateUi);
    });



});

