/**
 * Created by matteocantarelli on 02/12/2016.
 */
$(document).ready(function(){

    //resizeGame();

    window.setTimeout(function(){
        $('.otherplayer').popover('show');
    },1000);

    window.setTimeout(function(){
        $('.self').popover('show');
    },2000);

    window.addEventListener('resize', resizeGame, false);
    window.addEventListener('orientationchange', resizeGame, false);

});

function showInstructions(){
    $(".instructionsContainer").show();
}


function resizeGame() {
    $('.self').popover('show');
    $('.otherplayer').popover('show');
}