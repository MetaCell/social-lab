/**
 * Author: giovanniidili 23/01/2017
 */
$(document).ready(function () {

    var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
    var sessionId = $("#sessionId").html();
    var playerIdInSession = $("#playerIdInSession").html();
    var socket = new WebSocket(ws_scheme + "://" + window.location.host + "/chat/" + sessionId + "," + playerIdInSession + "/");
    var plainHistory = $("#plainHistory");
    var chatHistory = $("#chatHistory");

    socket.onmessage = function (e) {
        var message = JSON.parse(e.data);
        if ($("#chatHistory").children().length == 0) {
            $("#chatHistory").html("");
        }

        if (playerIdInSession != message.sender) {
            chatHistory.append("<div><div class='otherPlayerName'>Participant:</div><div class='chattext'>" + message.message + "</div></div>");
            plainHistory.val( plainHistory.val() + " \nOther:\n"+message.message);
            $("#otherPlayerMessage").html(message.message);
        }
        else {
            chatHistory.append("<div><div class='playerName'>You:</div><div class='chattext'>" + message.message + "</div></div>");
            plainHistory.val( plainHistory.val() + " \nSelf:\n"+message.message);
        }

        chatHistory.animate({scrollTop: chatHistory.prop("scrollHeight")}, 1000);

        // ignore other message types for now
        if (message.status === 'SESSION_CREATED') {
            // grab url and redirect
            var participantUrl = message.url;
            if (participantUrl != undefined) {
                window.location.href = participantUrl;
            }
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

