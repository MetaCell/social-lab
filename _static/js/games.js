/**
 * Created by matteocantarelli on 02/12/2016.
 */
$(document).ready(function () {


    window.setTimeout(function () {
        $('.otherplayer').popover('show');
        adjustPopovers('other');
    }, 1000);

    window.setTimeout(function () {
        $('.self').popover('show');

        adjustPopovers('self');
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

    window.shake = window.setInterval(function () {
        var other = $('.self .popover');
        other.addClass("shake");
        window.setTimeout(function () {
            other.removeClass("shake");
        }, 500);
    }, 10000);

    window.addEventListener('resize', resizeGame, false);
    window.addEventListener('orientationchange', resizeGame, false);

});

function showInstructions() {
    $(".instructionsContainer").show();
}


function adjustPopovers(x) {
    if (x == 'self' || x == undefined) {
        var self = $('.self .popover');
        self.css("left", "+=20");
        self.css("top", "-=10");
        $('.self .popover #selfMessage').focus();
    }
    if (x == 'other' || x == undefined) {
        var other = $('.otherplayer .popover');
        other.css("left", "-=20");
        other.css("top", "-=10");
    }

    $('.btn').prepend('<div class="hover"><span></span><span></span><span></span><span></span><span></span></div>');
}
function resizeGame() {
    $('.self').popover('show');
    $('.otherplayer').popover('show');
    adjustPopovers();

}