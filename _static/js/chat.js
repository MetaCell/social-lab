/**
 * Author: matteocantarelli
 * Author: giovanniidili
 */
$(document).ready(function () {
    // This object defines how many messages per player make up a round
    // NOTE: the first to send a message is considered to be P1
    var ROUND_DEFINITION = {
        P1: 4,
        P2: 4
    };

    // player id - populated dynamically based on who messages first
    var playerID = '';

    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var sessionId = $("#sessionId").html();
    var playerIdInSession = $("#playerIdInSession").html();
    var socket = new WebSocket(ws_scheme + "://" + window.location.host + "/chat/" + sessionId + "," + playerIdInSession + "/");
    var plainHistory = $("#plainHistory");
    var chatHistory = $("#chatHistory");

    $(".roundLabel").hide();
    $(".points").hide();

    var round = 0;
    var roundMsgSentCounter = 0;
    var roundMsgReceivedCounter = 0;
    var msgCounter = 0;

    socket.onmessage = function (e) {
        var message = JSON.parse(e.data);
        if ($("#chatHistory").children().length == 0) {
            $("#chatHistory").html("");
        }

        if (playerIdInSession != message.sender) {
            if(msgCounter == 0){
                playerID = 'P2';
            }

            roundMsgReceivedCounter++;

            chatHistory.append("<div><div class='otherPlayerName'>Participant:</div><div class='chattext'>" + message.message + "</div></div>");
            plainHistory.val( plainHistory.val() + " \nOther:\n"+message.message);
            $("#otherPlayerMessage").html(message.message);
        }
        else {
            if(msgCounter == 0){
                playerID = 'P1';
            }

            roundMsgSentCounter++;

            chatHistory.append("<div><div class='playerName'>You:</div><div class='chattext'>" + message.message + "</div></div>");
            plainHistory.val( plainHistory.val() + " \nSelf:\n"+message.message);
        }

        chatHistory.animate({scrollTop: chatHistory.prop("scrollHeight")}, 1000);

        // Question time
        msgCounter++;
        if(
            roundMsgSentCounter >= ROUND_DEFINITION[playerID == 'P1'? 'P1' : 'P2'] &&
            roundMsgReceivedCounter >= ROUND_DEFINITION[playerID == 'P1'? 'P2' : 'P1']
        ){
            // round completed - reset message counts
            round++;
            msgCounter=0;
            roundMsgSentCounter = 0;
            roundMsgReceivedCounter = 0;

            $("#round").html(round);
            //we check if there are questions every ROUND_MSG_FREQUENCY messages
            QuestionsController.showQuestions(round);
        }
    };

    // Call onopen directly if socket is already open
    if (socket.readyState == WebSocket.OPEN) {
        socket.onopen();
    }

    $(".typing").css("padding", "5px");
    $(".hiders").remove();
    clearInterval(window.shake);

    $(".playerContainer.self").on("keypress", "#selfMessage", function (e) {
        if (e.which == 13) {
            e.preventDefault();
            if ($("#selfMessage").val().trim() != "") {
                $("#sendButton").click();
            }
        }
    });

    $(".playerContainer.self").on("click", "#sendButton", function () {
        var message = $(".self #selfMessage").val();
        socket.send(message);
        $(".self #selfMessage").val("").focus();
    });
});

