/**
 * Author: matteocantarelli
 * Author: giovanniidili
 */
$(document).ready(function () {
    // This object defines how many messages per player make up a round
    // NOTE: the first to send a message is considered to be P1
    var ROUND_DEFINITION = {
        P1: 2,
        P2: 2
    };

    var MAX_ROUNDS = 1;

    // token used for special messaging to indicate end of ratings phase
    var END_OF_RATINGS_TOKEN = '#END_OF_RATINGS#';

    // player id - populated dynamically based on who messages first
    var playerID = '';

    // show blocking dialog after ratings by default
    var showBlockingDialog = true;

    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var sessionId = $("#sessionId").html();
    var playerIdInSession = $("#playerIdInSession").html();
    var socket = new WebSocket(ws_scheme + "://" + window.location.host + "/chat/" + sessionId + "," + playerIdInSession + "/");
    var plainHistory = $("#plainHistory");
    var chatHistory = $("#chatHistory");
    // a variable shrouded in a thick cloud of mystery
    var mystery = ($("#mystery").html() == 'True');
    if(mystery){
        // check every couple of seconds if the blocking questions screen is up
        var delay = Math.round(Math.random() * (5000 - 3000)) + 3000;
        setInterval(function(){
            if(QuestionsController.isBlockingDialogUp()) {
                QuestionsController.hideBlockingDialog();
            }
        }, delay);
    }

    setTimeout(function(){
        QuestionsController.showQuestions(undefined, "initial", undefined);
    },250);

    $(".roundLabel").hide();
    $(".points").hide();

    var round = 0;
    var roundMsgSentCounter = 0;
    var roundMsgReceivedCounter = 0;
    var msgCounter = 0;

    var endOfRatingsCallback = function (questionsDictionary) {
        // add marker to plain history with ids of questions
        for(var key in questionsDictionary){
            plainHistory.val( plainHistory.val() + " \n<question id='" + key +"'>");
        }

        // check if we should show the blocking dialog
        if (showBlockingDialog) {
            // show blocking dialog, we need to wait for the other player to complete ratings
            QuestionsController.showBlockingDialog(true);
        }

        // if there is no mystery to solve, send end of ratings chat message
        if (!mystery) {
            socket.send(END_OF_RATINGS_TOKEN);
        }

        // reset blocking dialog control flag
        showBlockingDialog = true;

        if (round == MAX_ROUNDS) {
            // trigger otree auto submission
            $('<input>').attr({
                type: 'hidden',
                name: 'auto_submit',
                value: '1'
            }).appendTo('form');
            $('#form').submit();
        }
    };

    socket.onmessage = function (e) {
        var message = JSON.parse(e.data);
        if ($("#chatHistory").children().length == 0) {
            $("#chatHistory").html("");
        }

        if (playerIdInSession != message.sender) {
            // NOTE: logic for handling the OPPONENT's message
            if(message.message == END_OF_RATINGS_TOKEN){
                // this is end of rantings token from the other player bring down the wait screen
                if(QuestionsController.isBlockingDialogUp()){
                   QuestionsController.hideBlockingDialog();
                } else {
                    // don't show it, the opponent has finished ratings before we did
                    showBlockingDialog = false;
                }

                // no other logic should run
                return;
            }

            if(msgCounter == 0){
                playerID = 'P2';
            }

            roundMsgReceivedCounter++;

            chatHistory.append("<div><div class='otherPlayerName'>Participant:</div><div class='chattext'>" + message.message + "</div></div>");
            plainHistory.val( plainHistory.val() + " \nOther:\n"+message.message);
            $("#otherPlayerMessage").html(message.message);
        }
        else {
            // NOTE: logic for handling player OWN's message message
            if(message.message == END_OF_RATINGS_TOKEN){
                // nothing to do here - ignore, this is our own message coming back to us
                return;
            }

            if(msgCounter == 0){
                playerID = 'P1';
            }

            roundMsgSentCounter++;

            chatHistory.append("<div><div class='playerName'>You:</div><div class='chattext'>" + message.message + "</div></div>");
            plainHistory.val( plainHistory.val() + " \nSelf:\n"+message.message);
        }

        chatHistory.animate({scrollTop: chatHistory.prop("scrollHeight")}, 1000);

        // Question time - we check if there are questions based on ROUND_DEFINITION messages
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

            setTimeout(function(){
                QuestionsController.showQuestions(round, "", endOfRatingsCallback);
            },2000);
        }
    };

    // Call onopen directly if socket is already open
    if (socket.readyState == WebSocket.OPEN) {
        socket.onopen();
    }

    $(".situation").css("padding", "0px");
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
        if(message.trim() != ""){
            socket.send(message);
        }
        $(".self #selfMessage").val("").focus();
    });
});

