/**
 * Created by matteocantarelli on 02/12/2016.
 */
$(document).ready(function(){

    window.setTimeout(function(){
        $('.otherplayer').popover('show');
    },1000);

    window.setTimeout(function(){
        //$('.otherplayer').popover('hide');
        $('.self').popover('show');
    },2000);


});

function showInstructions(){
    $(".instructionsContainer").show();
}
