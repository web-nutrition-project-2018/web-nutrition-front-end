
// this block might be a possible solution for having the same size of the backside of card as front
var heightFront, heightBack;

heightFront = $('.front').height();
heightBack = $('.back').height();

if(heightFront > heightBack){
    $('.card').height(heightFront);
}else{
    $('.card').height(heightBack);
}

//card flipping
$(document).ready(function () {
    $(".card").flip();
});
