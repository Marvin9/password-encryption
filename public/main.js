$(document).ready(function(){
    $('body').show(1000);

    //show and hide password
   $('.eyes').hover(() => {
       $('.input_pass').attr("type", "text");
   }, () => {
    $('.input_pass').attr("type", "password");
   });

   //when press enter
   $('.input_pass').keypress((e) => {
       let keycode = e.keyCode;
       if(keycode == 13)
       {
           $('input[type="submit"]').click();
       }
   });

   //page slide
   $('.arrow-right').click(() => {
       $('.user-id').css('left', '0');
       $('.arrow-right').css('right', '100vw');
   });
   $('.arrow-left').click(() => {
       $('.user-id').css('left', '100%');
       $('.arrow-right').animate({
           right : "20px"
       }, 1000);
   });

});