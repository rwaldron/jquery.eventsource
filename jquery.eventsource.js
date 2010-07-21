
;(function ($) {
  
  var streamSrcSettings  = {
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

      isJson:       function ( arg ) {
        if ( arg === null ) return false;
        
        var _test = $.isPlainObject(arg) ? JSON.stringify(arg) : arg;
      
        return ( new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$') ).test(_test);        
      },    
    
    
      openEventSource: function ( options ) {
           



        streamCache[options.label].stream.addEventListener('open', function (event) {
        
          // TODO....
          console.log(event);
        }, false);


        streamCache[options.label].stream.addEventListener('message', function (event) {
        
          var 
          streamData  = [];
          
          streamData.push(
            pluginSubFn._private.isJson(event.data) ? 
              JSON.parse(event.data) : 
              event.data
          );
          
          streamCache[options.label].lastEventId = event.lastEventId;

          options.message.call(this, streamData, {
            data: streamData,
            lastEventId: streamCache[options.label].lastEventId
          });
          
          
          
        }, false);        
      }, 
      openPollingSource: function ( options ) {
        var source  = $.ajax({
          type:       'GET',
          url:        options.url,
          data:       options.data,
          beforeSend: function ( data ) {
            //console.log(data);
            //options.open.call(this, data);
          },
          success: function ( data ) {

            //console.log(data);

            var 
            
            parsedData  = [],
            streamData  = $.map(  data.split("\n"), function (sdata, i) {
              if ( sdata ) {
                return sdata;
              }
            });
            
            //console.log(streamData);
            
            if ( $.isArray(streamData) ) {
              for ( var i = 0; i < streamData.length; i++ ) {
                
                
                var tempdata  = streamData[i].split(': ')[1];
                
                // CONVERT TO PROPER `dataType` HERE
                if ( options.dataType === 'json' ) {
                  tempdata  = JSON.parse(tempdata);
                }

              
                parsedData.push(tempdata);
              }
            }
            
            streamCache[options.label].lastEventId++;
            
            

            options.message.call(this, parsedData, {
              data: parsedData,
              lastEventId: streamCache[options.label].lastEventId
            });

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
    isNative: false, 
    options: {}
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
      _options        = $.extend({}, streamSrcSettings, options);
      

      stream  = !isNative ? 
                  pluginSubFn._private.openPollingSource(_options) :
                  new EventSource(_options.url + ( _options.data ? '?' + _options.data : '' ) );

        
      //  ADD TO EVENT SOURCES
      streamCache[_options.label] = $.extend({}, streamSetup, {
        stream: stream, 
        isNative: isNative, 
        options: _options
      });
      
      if ( isNative ) {
        pluginSubFn._private.openEventSource(_options);
      }
      
      
      //  !!!!! !USE ONLY FOR DEV - MUST BE REMOVED.
      setTimeout(function () {
        
        stream.close();
      
      }, 1000);
      
      
      return streamCache;
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



});