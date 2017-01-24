/**
 * Author: giovanniidili 23/01/2017
 */
$(document).ready(function () {
    var game = getParameterByName('game');

    $('#ready-button').click(function () {
        $('#ready-button').hide();
        $('#message-panel').append('<p>Looking for an opponent</p>');

        if (game != undefined && game != null) {
            socket = new WebSocket("ws://" + window.location.host + "/matchmaking/" + game + "/");

            socket.onmessage = function (e) {
                $('#message-panel').append('<p>' + e.data + '</p>');
                // TODO: on match found message redirect to game URL
            };

            socket.onopen = function () {
                socket.send("a new user wants to play " + game);
            };

            // Call onopen directly if socket is already open
            if (socket.readyState == WebSocket.OPEN){
                socket.onopen();
            }
        } else {
            $('#message-panel').html('Error: no game selected!');
        }
    });
});

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}