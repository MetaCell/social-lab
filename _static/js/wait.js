/**
 * Author: giovanniidili 23/01/2017
 */
$(document).ready(function () {
    var game = getParameterByName('game');

    $('#ready-button').click(function () {
        $('#ready-button').hide();
        $('#instructions_label').hide();
        $("#loader").show();
        $('#message-panel').append('<p>Looking for an opponent...</p>');

        if (game != undefined && game != null) {
            var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";
            socket = new WebSocket(ws_scheme + "://" + window.location.host + "/matchmaking/" + game + "/");

            socket.onmessage = function (e) {
                var message = JSON.parse(e.data);

                // log message for debugging
                console.log('Message received: ' + message.status + ' / ' + message.message);

                // ignore other message types for now
                if (message.status === 'SESSION_CREATED') {
                    // grab url and redirect
                    var participantUrl = message.url;
                    if (participantUrl != undefined) {
                        window.location.href = participantUrl;
                    }
                }
            };

            socket.onopen = function () {
                socket.send("a new user wants to play " + game);
            };

            // Call onopen directly if socket is already open
            if (socket.readyState == WebSocket.OPEN) {
                socket.onopen();
            }
        } else {
            console.log('Error: no game selected!');
        }
    });
});

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

