/**
 * Author: giovanniidili 23/01/2017
 */
$(document).ready(function () {
    var game = getParameterByName('game');

    // TODO: grab platform (mturk/prolific) and options params

    // TODO: if platform is found, show worker id input field (if present in query string fill it out from there)

    $('#ready-button').click(function () {

        // TODO: if platform field is detected let the user queue only if they filled out the worker id field

        $('#ready-button').hide();
        $('#instructions_label').hide();
        $("#loader").show();
        $('#message-panel').append('<p>Looking for an opponent...</p>');

        if (game != undefined && game != null) {
            var pollingInterval = undefined;
            var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";

            // TODO: concat platform (mturk/prolific), worker id and options params (url redirect on completion) if any
            window.socket = new WebSocket(ws_scheme + "://" + window.location.host + "/matchmaking/" + game + "/");

            socket.onmessage = function (e) {
                var message = JSON.parse(e.data);

                // log message for debugging
                console.log('Message received: ' + message.status + ' / ' + message.message);

                // ignore other message types for now
                if (message.status === 'SESSION_CREATED') {
                    if (pollingInterval != undefined) {
                        clearInterval(pollingInterval);
                    }

                    // grab url and redirect
                    var participantUrl = message.url;
                    if (participantUrl != undefined) {
                        window.location.href = participantUrl;
                    }
                }
            };

            socket.onopen = function () {
                // nothing for now on open
            };

            // Call onopen directly if socket is already open
            if (socket.readyState == WebSocket.OPEN) {
                socket.onopen();
            }

            var pollingInterval = Math.round(Math.random() * (13500 - 3500)) + 3500;
            pollingInterval = startPolling(socket, pollingInterval);
        } else {
            console.log('Error: no game selected!');
        }
    });
});

function startPolling(w_socket, interval) {
    return setInterval(function () {
        var payload = {'status': 'POLLING', 'message': ''};
        w_socket.send(JSON.stringify(payload));
    }, interval);
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

