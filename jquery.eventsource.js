
;(function ($) {

  var defaults  = {
  
  };
  
  $.fn.eventsource = function (options) {
    
    var opts  = $.extend({}, defaults, options);
    
    return this.each(function () {
      
      /*
        create event source, 
        
        feature detect, fallback to long polling xhr if no support
        
        process callback
        
        feed return to selector(s)
      
      */
     
      
      
    });
  
  };
  


})(jQuery);



$(function () {
  
  //  USE CASES/EXAMPLES 
  //  ROUGHING OUT THE API
  
  
  //  Calling on and pushing contents to elements
  $('div').eventsource({
    url:    'eventsource uri',
    event:  function (data) {
      
      //do something with the data
      
      return foo;
    
    }
  });
  
  
  // Calling and doing whatever
  $.eventsource({
    url:    'eventsource uri',
    event:  function (data) {
      
      //do something with the data
      
      
    
    }
  });


});