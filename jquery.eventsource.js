
;(function ($) {

  var defaults  = {
    url:      location.href,
    connect:  $.noop,
    event:    $.noop
  };
  
  $.fn.eventsource = function (options) {
    
    var opts  = $.extend({}, defaults, options);
    
    return this.each(function () {
      
      /*
        create event source, 
        
        feature detect, fallback to long polling xhr if no support
        
        connect to event source; 
        
        eventsource dom events:
        
          - trigger connect callback when connect event is fired, if set
        
          - trigger event callback when message event is fired, if set
          
          
        
        
        if $.fn.eventsource:
          - process callbacks (above)
          - feed return to selector(s)
          
        if $.eventsource
          - process callbacks
          
          
        
        additonally, the first arg to the callbacks should be a normalized copy of the
        contents found at event.data, where the second arg should be the event object.
      
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