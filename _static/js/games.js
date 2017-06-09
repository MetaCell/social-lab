/**
 * Created by matteocantarelli on 02/12/2016.
 */
$(document).ready(function () {

    var game = $("#game").html();
    var page = $("#page").html();
    var round = $("#roundCount").html();

    if (round != "") {
        $(".roundLabel").html("Round " + round);
    }
    else {
        $(".roundLabel").hide();
    }

    var points = $("#points").html();
    if (points != "None" && points != "") {
        $(".pointsLabel").html(points);
    }
    else {
        $(".points").hide();
    }


    window.setTimeout(function () {
        $('.otherplayer').popover('show');
        adjustPopovers('other');
    }, 1000);

    window.setTimeout(function () {
        $('.self').popover('show');
        adjustPopovers('self');
    }, 5000);

    if (game != 'chat' || page=='final'){
        // ask mid-round question after giving some time to read what happened
        // NOTE: this does not apply to chat game that controls when questions are shown
        window.setTimeout(function () {
            //for round based games, we show questions at the beginning
            QuestionsController.showQuestions($("#round").html(), $("#page").html());
        }, 5000);
    }

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

    QuestionsController.init(game);
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