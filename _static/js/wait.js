/**
 * Created by giovanniidili on 23/01/2017.
 */
$(document).ready(function(){
    var game = getParameterByName('game');

    $('#ready-button').click(function(){
        // TODO: open web-socket connection
        // TODO: queue up user
        // TODO: listen to messages
        // TODO: on match found message redirect to game URL
    });
});

function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}