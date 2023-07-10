/* handles mouseover and mouseout CSS effects */

$(document).ready(function() {
    // pencil effects
    $('.pencil').mouseover(function() {
       $('.pencil').removeClass("pencil-out");
       $(this).addClass("pencil-over");
    });
    $('.pencil').mouseout(function() {
       $('.pencil').removeClass("pencil-over");
       $(this).addClass("pencil-out");
    });
    $('.pencil').click(function() {
       $('.eraser').removeClass("eraser-selected");
       $('.pencil').removeClass("pencil-selected");
       $(this).addClass("pencil-selected");
    });
    
    
    //point size effects
    $('.point-size').mouseover(function() {
       $('.point-size').removeClass("point-size-out");
       $(this).addClass("point-size-over");
    });
    $('.point-size').mouseout(function() {
       $('.point-size').removeClass("point-size-over");
       $(this).addClass("point-size-out");
    });
    $('.point-size').click(function() {
       $('.point-size').removeClass("point-size-selected");
       $(this).addClass("point-size-selected");
    });
    
    
    //eraser effects
    $('.eraser').mouseover(function() {
       $('.eraser').removeClass("eraser-out");
       $(this).addClass("eraser-over");
    });
    $('.eraser').mouseout(function() {
       $('.eraser').removeClass("eraser-over");
       $(this).addClass("eraser-out");
    });
    $('.eraser').click(function() {
       $('.pencil').removeClass("pencil-selected");
       $(this).addClass("eraser-selected");
    });
});