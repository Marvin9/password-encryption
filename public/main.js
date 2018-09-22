function slide_page_right() 
{
    $('.user-id').css('left', '0');
    $('.arrow-right').css('right', '100vw');
}

function slide_page_left()
{
    $('.user-id').css('left', '100%');
       $('.arrow-right').animate({
           right : "20px"
       }, 1000);
}

$(document).ready(function(){
    $('body').show(1000);
 
   //key left and right
   let user_form_section = 1;
   $(document).keydown((e) => {
       let keycode = e.keyCode;
       if(keycode == 39 && user_form_section == 1)
       {
            slide_page_right();
            user_form_section = 0;
       }
       if(keycode == 37 && user_form_section == 0)
       {
           slide_page_left();
           user_form_section = 1;
       }
   });


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
       slide_page_right();
   });
   $('.arrow-left').click(() => {
       slide_page_left();
   });

});