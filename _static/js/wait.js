/**
 * Created by giovanniidili on 23/01/2017.
 */
$(document).ready(function(){
    var game = getParameterByName('game');

    switch (game) {
    case 'ultimatum':
        $('#game-description').append('Ultimatum game description');
        break;
    case 'trust':
        $('#game-description').append('Trust game description');
        break;
    case 'prisoner-dilemma':
        $('#game-description').append('Peace-war game description');
        break;
    case 'chat':
        $('#game-description').append('Chat game description');
        break;
    default:
        $('#game-description').append('No game selected!');
        $('#ready-button').hide();
        break;
    }

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