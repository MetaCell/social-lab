/**
 * Author: matteocantarelli 03/02/2017
 */
$(document).ready(function () {
    $("#vaughan").hover(function(){
        var rect = $("#vaughan").offset();
        $("#portrait").css("top",rect.top-120);
        $("#portrait").css("left",rect.left-10);
        $("#portrait").show();

    },function(){
        $("#portrait").hide();
    });

});

