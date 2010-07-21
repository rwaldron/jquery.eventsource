
;(function ($) {
  
  var eventSourceSettings  = {
    //  IDENTITY  
    label:    '',
    url:      location.href,
    
    //  EVENT CALLBACKS
    open:  $.noop,
    message: $.noop,
    
    //  EXTEND `accepts` OBJECT
    accepts: $.extend({}, $.ajaxSettings.accepts, {
      stream : 'text/event-stream'
    
    })   
  },
  pluginSubFn  = {
    
    public: {
      close: function ( label ) {
        if ( !isNative ) {
          
          // ajax abort
          
        }
        
        streamCache[label] && streamCache[label].stream.close();  
      },
      delete: function ( label ) {
        if ( streamCache[label] ) {
          return;
        }
        //streamCache[label] && ( delete streamCache[label] );
        
        var cache = {};
        
        for ( var prop in streamCache ) {
          if ( label  !== prop ) {
            cache[prop] = streamCache[prop];
          }
        }
        
        streamCache = cache;
      }
    },    
    _private: {
      openEventSource: function ( label ) {
        console.log(streamCache);      



        //stream.addEventListener('open', function (event) {
        //  console.log(event);
        //}, false);


        //stream.addEventListener('message', function (event) {
          //console.log(event);
        //}, false);        
      }, 
      openPollingSource: function ( options ) {
        var source  = $.ajax({
          type:       'GET',
          url:        options.url,
          data:       options.data,
          dataType:   options.dataType,
          beforeSend: function ( data ) {
            //console.log(data);
            //options.open.call(this, data);
          },
          success: function ( data  ) {

            console.log(data);

            var streamData  = data.split(': '); // data streams MUST follow the "data: " format.

            console.log(streamData);


            //options.message.call(this, data);



            /*
            setTimeout(
              function () {
                pluginSubFn._private.openPollingSource.call(this, options);
              },
              5000000//500 // matches speed of native EventSource
            );
            */
          },
          cache:      false,
          timeout:    50000,
          accepts:    options.accepts
        });

        return source;
      }
    }
  },
  streamSetup = {
    stream: {}, 
    lastEventId: 0,
    isNative: false
  },
  streamCache = {},
  isNative    = window.EventSource ? true : false 
  ;

  $.extend({
    
    eventsource: function ( options ) {
      
      var stream, _options;
      
      //  PLUGIN sUB FUNCTION
      if ( options && !$.isPlainObject(options) && pluginSubFn.public[options] ) {
        
        
        return;
      }
    
      
      //  IF PARAMS WERE PASSED IN AS AN OBJECT, NORMALIZE TO A QUERY STRING
      options.data    = options.data && $.isPlainObject(options.data) ? 
                          $.param(options.data) : 
                          options.data;      
      
      //  IF NO EXPLICIT LABEL, SET INTERNAL LABEL
      options.label   = !options.label ? 
                          options.url + '?' + options.data : 
                          options.label;
      
      //  CREATE NEW OPTIONS OBJECT
      _options        = $.extend({}, eventSourceSettings, options);
      

      stream  = !isNative ? 
                  pluginSubFn._private.openPollingSource(_options) :
                  new EventSource(_options.url + ( _options.data ? '?' + _options.data : '' ) );

        
      //  ADD TO EVENT SOURCES
      streamCache[_options.label] = $.extend({}, streamSetup, {
        stream: stream, 
        isNative: isNative
      });
      
      if ( isNative ) {
        pluginSubFn._private.openEventSource();
      }
      
      
      
      /*
      setTimeout(function () {
        
        stream.close();
      
      }, 1000);
      
      */


      return streamCache;
    
    /*
        create event source, 

        feature detect
        
          - fallback to long polling xhr if no support

        connect to event source; 

        eventsource dom events:

          - trigger open callback when open event is fired, if set

          - trigger message callback when message event is fired, if set

        if $.eventsource
          - process callbacks


        additonally, the first arg to the callbacks should be a normalized copy of the
        contents found at event.data, where the second arg should be the event object.

      */
    }
  });

})(jQuery);



$(function () {
  
  //  USE CASES/EXAMPLES 
  //  ROUGHING OUT THE API
  

  
  // PLAIN TEXT EXAMPLE - NO CONTENT TYPE GIVEN
  $.eventsource({
    url:      'test-event-sources/event-source-1.php',
    open:  function (data) {
      console.group('$.eventsource() - Example 1 : TEXT open callback');
        console.log( 'opened' );
        console.log(data);
      console.groupEnd('$.eventsource() - Example 1 : TEXT open callback');
    },
    message:  function (data) {
      console.group('$.eventsource() - Example 1 : TEXT message callback');
        console.log( 'message received' );
        console.log(data);
      console.groupEnd('$.eventsource() - Example 1 : TEXT message callback');
    }
  });
  // PLAIN TEXT EXAMPLE - HAS CONTENT TYPE
  $.eventsource({
    url:      'test-event-sources/event-source-1.php',
    dataType: 'text',
    open:  function (data) {
      console.group('$.eventsource() - Example 2 : TEXT open callback');
        console.log( 'opened' );
        console.log(data);
      console.groupEnd('$.eventsource() - Example 2 : TEXT open callback');
    },
    message:  function (data) {
      console.group('$.eventsource() - Example 2 : TEXT message callback');
        console.log( 'message received' );
        console.log(data);
      console.groupEnd('$.eventsource() - Example 2 : TEXT message callback');
    }
  });


  // JSON EXAMPLE - HAS CONTENT TYPE
  $.eventsource({
    url:      'test-event-sources/event-source-2.php',
    dataType: 'json',
    open:  function (data) {
      console.group('$.eventsource() - Example 3 : JSON open callback');
        console.log( 'opened' );
        console.log(data);
      console.groupEnd('$.eventsource() - Example 3 : JSON open callback');
    },
    message:  function (data) {
      console.group('$.eventsource() - Example 3 : JSON message callback');
        console.log( 'message received' );
        console.log(data);
      console.groupEnd('$.eventsource() - Example 3 : JSON message callback');
    }
  });


  // JSON EXAMPLE - HAS CONTENT TYPE
  $.eventsource({
    url:      'test-event-sources/event-source-3.php',
    dataType: 'json',
    open:  function (data) {
      console.group('$.eventsource() - Example 4 : JSON open callback');
        console.log( 'opened' );
        console.log(data);
      console.groupEnd('$.eventsource() - Example 4 : JSON open callback');
    },
    message:  function (data) {
      console.group('$.eventsource() - Example 4 : JSON message callback');
        console.log( 'message received' );
        console.log(data);
      console.groupEnd('$.eventsource() - Example 4 : JSON message callback');
    }
  });  

});