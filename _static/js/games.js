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

    // this code shouldn't run for chat and final page
    if (game != 'chat' && page != 'final'){
        // ask mid-round question after giving some time to read what happened
        // NOTE: this does not apply to chat game that controls when questions are shown based on internal round definition
        var questionTimeout=5000;
        if(page=="initial"){
            questionTimeout=250;
        }
        window.setTimeout(function () {
            //for round based games, we show questions at the beginning
            QuestionsController.showQuestions($("#round").html(), page);
        }, questionTimeout);
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

    // only apply disconnection logic if we are not at the final page where disconnection is normal
    if(page != 'final') {
        window.disconnectionPollingCounter = 0;
        window.disconnectionPollingInterval = undefined;
        var disconnectionPollingSocket = setupDisconnectionPollingSocket();
        if (disconnectionPollingSocket != undefined) {
            disconnectionPollingSocket.onmessage = function (e) {
                var message = JSON.parse(e.data);

                // log message for debugging
                console.log('Message received: ' + message.status + ' / ' + message.player_disconnected);

                // ignore other message types for now
                if (message.status === 'DISCONNECTION_STATUS') {
                    // increase or reset disconnection counter
                    if (message.player_disconnected == true) {
                        window.disconnectionPollingCounter += 1;
                    } else {
                        window.disconnectionPollingCounter = 0;
                    }
                }
            };
            setupDisconnectionPollingMessages(disconnectionPollingSocket);
        }
    }
});

function setupDisconnectionPollingSocket() {
    //connect to the socket
    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var sessionId = $("#sessionId").html();
    var playerIdInSession = $("#playerIdInSession").html();
    var participantCode = $("#participantCode").html();

    var socket = undefined;
    if(sessionId != '' && sessionId != undefined){
        var socket = new WebSocket(ws_scheme + "://" + window.location.host + "/disconnection/" + sessionId + "," + playerIdInSession + "," + participantCode + "/");
    }

    return socket;
}

function setupDisconnectionPollingMessages(pollingSocket) {
    var sendPollingMessage = function(){
        if(window.disconnectionPollingCounter < 4) {
            var message = '{"type":"DISCONNECTION_POLLING"}';
            pollingSocket.send(message);
        } else {
            // kill disconnection polling loop
            window.clearInterval(window.disconnectionPollingInterval);

            var MTURK_DESCRIPTION = "mTurk Task Completed!<br/> Please copy-paste the session code below into the survey before closing this page.";
            var PROLIFIC_DESCRIPTION = "Prolific Task Completed!<br/> Please copy-paste the session code below into the survey and click on the link before closing this page.";
            var platform = $('#platform').html();
            var worker_id = $('#worker_id').html();
            var completion_url = $('#completion_url').html();
            var session_id = $('#session_id').html();
            var page = $('#page').html();

            // make sure the user is not at the end already in that case disconnection is normal
            if(!(page === 'final')) {
                // raise disconnection message
                var disconnectionMsg = 'Your opponent has disconnected!';
                $('#disconnection-notification-dialog .modal-content').append("<p>" + disconnectionMsg + "</p>");

                if (platform != '') {
                    // append rest of the message message in case of external platform
                    var contentText = (platform == 'mturk') ? MTURK_DESCRIPTION : PROLIFIC_DESCRIPTION;
                    $('#disconnection-notification-dialog .modal-content').append("<p>" + contentText + "</p>");

                    // show session id
                    $('#disconnection-notification-dialog .modal-content').append("<p>Session Code: <b style='color:red'>" + session_id + "</b></p>");

                    // show completion url if any as clickable
                    if (completion_url != '') {
                        $('#disconnection-notification-dialog .modal-content').append("<p><a href='" + completion_url + "' target='_blank'>Click here to complete the task</p>");
                    }
                }

                // hide any other modal dialog we might have been showing
                $('div.modal-dialog:visible').hide();
                $('div.modal:visible').hide();
                $('div.modal-backdrop:visible').hide();

                // show disconnect notification
                $("#disconnection-notification-dialog").modal({backdrop: 'static', keyboard: false});
            }
        }
    };

    window.disconnectionPollingInterval = window.setInterval(sendPollingMessage, 5000);
}

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