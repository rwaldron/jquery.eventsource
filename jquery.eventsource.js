
;(function ($) {

  var defaults  = {
  
  };
  
  $.fn.eventsource = function (options) {
    
    var opts  = $.extend({}, defaults, options);
    
    return this.each(function () {
      
      /*
        create event source
        
        process callback
        
        feed return to selector(s)
      
      */
     
      
      
    });
  
  };
  


})(jQuery);



$(function () {
  
  //  USE CASES/EXAMPLES 
  //  ROUGHING OUT THE API
  
  $('div').eventsource({
    url:    'eventsource uri',
    event:  function (data) {
      
      //do something with the data
      
      return foo;
    
    }
  });


});