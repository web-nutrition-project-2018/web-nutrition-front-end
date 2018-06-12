$(document).ready(function () {

    $('.flip-container').click(function(){
        $('.card').flip({
            //some optional stuff for flipping animation
            axis: 'x',
            //trigger: 'hover',
            speed:200});
        return false;
    }).mouseleave(function () {
        $('.flip-container > .card').removeClass('flipped');
    });

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

    //load imprint when clicking on the "i"
    $('#imprint').click(function() {
        // $('html').load('imprint.html');
        window.location.href = "imprint.html";
    })

    //go back to landing page
    $('#back-arrow').click(function() {
        window.location.href = "popup.html";
    })
})