/**
 * Created by matteocantarelli on 02/12/2016.
 */
$(document).ready(function () {

    //resizeGame();

    window.setTimeout(function () {
        $('.otherplayer').popover('show');
    }, 1000);

    window.setTimeout(function () {
        $('.self').popover('show');
    }, 2000);

    window.setInterval(function () {
        var other = $('.player.otherplayer');
        if (other.hasClass("flip")) {
            other.removeClass("flip");
            other.addClass("unflip");
        } else {
            other.removeClass("unflip");
            other.addClass("flip");
        }
    }, 5000);

    window.setInterval(function () {
        var other = $('.self .popover');
        other.addClass("shake");
        window.setTimeout(function () {
            other.removeClass("shake");
        },500);
    }, 10000);

    window.addEventListener('resize', resizeGame, false);
    window.addEventListener('orientationchange', resizeGame, false);

});

function showInstructions() {
    $(".instructionsContainer").show();
}


function resizeGame() {
    $('.self').popover('show');
    $('.otherplayer').popover('show');
}