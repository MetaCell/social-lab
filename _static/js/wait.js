/**
 * Author: giovanniidili
 */
$(document).ready(function () {
    var game = getParameterByName('game');
    // external platform parameters
    var platform = getParameterByName('platform');
    var workerId = getParameterByName('workerId');
    var completionUrl = getParameterByName('completion_url');

    var WORKER_ID_MIN_LENGTH = 5;

    // if platform field is detected let the user queue only if they filled out the worker id field
    if(platform != undefined && platform != ""){
        // pre-populate worker id if any
        if(workerId != undefined && workerId != ""){
            $('#worker-id').val(workerId);
        } else {
            // hookup even thandler for submit
            $('#worker-id-submit').click(function(){
                // check value
                var value = $('#worker-id').val();

                // TODO: check that worker id is only made up of allowed chars with a regex
                if(value != "" && value.length > WORKER_ID_MIN_LENGTH){
                    // store id, hide dialog
                    workerId = value;
                    $('#worker-id-dialog').hide();
                } else {
                    // worker-id-feedback
                    $("#worker-id-feedback").css({ 'color': 'red'});
                }
            });

            // set text
            var platformDisplay = (platform == 'mturk') ? 'Mechanical Turk' : 'Prolific';
            $("#worker-id-feedback").html("Please submit your " + platformDisplay + " worker-id to continue");

            // bring up dialog asking for worker id
            $('#worker-id-dialog').show();
        }
    }

    $('#ready-button').click(function () {
        $('#ready-button').hide();
        $('#instructions_label').hide();
        $("#loader").show();
        $('#message-panel').append('<p>Looking for an opponent...</p>');

        if (game != undefined && game != null) {
            var pollingInterval = undefined;
            var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";

            // concat platform (mturk/prolific), worker id and options params (url redirect on completion) if any
            var paramsString = getParametersString(game, platform, workerId);
            window.socket = new WebSocket(ws_scheme + "://" + window.location.host + "/matchmaking/" + paramsString + "/");

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
                // if we have a completion url, send it as message once the socket is open for business
                if(completionUrl != '' && completionUrl != undefined) {
                    // NOTE: cannot be sent as url param, breaking characters
                    sendSocketMessage(socket, 'SET_COMPLETION_URL', completionUrl);
                }
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

function sendSocketMessage(w_socket, status, value){
    var payload = {'status': status, 'message': value};
    w_socket.send(JSON.stringify(payload));
}

function startPolling(w_socket, interval) {
    return setInterval(function () {
        sendSocketMessage(w_socket, 'POLLING', '');
    }, interval);
}

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getParametersString(game, platform, workerId, completion_url){
    var paramsString = game;

    if(platform != '' && platform != undefined){
        paramsString+= ","+platform;

        if(workerId != '' && workerId != undefined) {
            paramsString += "," + workerId;
        }

        if(completion_url != '' && completion_url != undefined) {
            paramsString += "," + encodeURIComponent(completion_url);
        }
    }

    return paramsString;
}

