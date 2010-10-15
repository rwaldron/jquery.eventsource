/*!
 * jQuery Event Source
 * 
 * Copyright (c) 2010 Rick Waldron
 * Dual licensed under the MIT and GPL licenses.
 */

;(function ($) {
  
  var streamDefaults  = {
    //  IDENTITY  
    label:    null,
    url:      null,
    
    //  EVENT CALLBACKS
    open:     $.noop,
    message:  $.noop,
    
    //  EXTEND `accepts` OBJECT
    accepts: $.extend({}, $.ajaxSettings.accepts, {
      stream: 'text/event-stream'
    })
  },
  streamCache = {}, 
  pluginFns   = {
    
    public: {
      close: function ( label ) {
        
        var cache = {};
        
        if ( label !== '*' ) {
        
          for ( var prop in streamCache ) {
            if ( label  !== prop ) {
              cache[prop] = streamCache[prop];
            }
          }
        }
        
        streamCache = cache;
        
        return streamCache;
      }, 
      streams: function ( label ) {
      
        if ( label === '*' ) {
          return streamCache;
        }
        
        return streamCache[label] || {};
      }
    },    
    _private: {

      isJson:       function ( arg ) {
        if ( arg === null ) {
          return false;
        }
        
        return ( 
          new RegExp('^("(\\\\.|[^"\\\\\\n\\r])*?"|[,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t])+?$') 
        ).test($.isPlainObject(arg) ? JSON.stringify(arg) : arg);        
      },    
    
      //  Open a native event source 
      openEventSource: function ( options ) {
           
        streamCache[options.label].stream.addEventListener('open', function (event) {
          if ( streamCache[options.label] ) {
          
            this['label']  = options.label;
            
            streamCache[options.label].options.open.call(this, event);
          }   
        }, false);


        streamCache[options.label].stream.addEventListener('message', function (event) {
          
          if ( streamCache[options.label] ) {
          
            var streamData  = [];

            streamData[streamData.length] = pluginFns._private.isJson(event.data) ? 
                                              JSON.parse(event.data) : 
                                              event.data
                

            this['label']  = options.label;
            
            streamCache[options.label].lastEventId = +event.lastEventId;
            streamCache[options.label].history[streamCache[options.label].lastEventId]  = streamData;
            streamCache[options.label].options.message.call(this, streamData[0] ? streamData[0] : null, {
              data: streamData,
              lastEventId: streamCache[options.label].lastEventId
            }, event);
          }          
        }, false);        
      }, 
      // open fallback event source
      openPollingSource: function ( options ) {
        
        if ( streamCache[options.label] ) {
        
          var source  = $.ajax({
            type:       'GET',
            url:        options.url,
            data:       options.data,
            beforeSend: function () {
              if ( streamCache[options.label] ) {
                
                this['label'] = options.label;
                streamCache[options.label].options.open.call(this);
              }   
            },
            success: function ( data ) {

              var tempdata,
                  parsedData  = [],
                  streamData  = $.map(  data.split("\n"), function (sdata, i) {
                                  if ( sdata ) {
                                    return sdata;
                                  }
                                });

              if ( $.isArray(streamData) ) {
              
                for ( var i = 0; i < streamData.length; i++ ) {

                  tempdata  = streamData[i].split('data: ')[1];
                  
                  // CONVERT TO PROPER `dataType` HERE
                  if ( options.dataType === 'json' ) {
                    tempdata  = JSON.parse(tempdata);
                  }


                  parsedData[parsedData.length] = tempdata;
                }
              }
              
              if ( streamCache[options.label] ) {
                
                
                this['label'] = options.label;
                
                streamCache[options.label].lastEventId++;
                streamCache[options.label].history[streamCache[options.label].lastEventId]  = parsedData;
                streamCache[options.label].options.message.call(this, parsedData[0] ? parsedData[0] : null, {
                  data: parsedData,
                  lastEventId: streamCache[options.label].lastEventId
                });


                setTimeout(
                  function () {
                    pluginFns._private.openPollingSource.call(this, options);
                  },
                  500// matches speed of native EventSource
                );
              }                
            },
            cache:      false,
            timeout:    50000,
            accepts:    options.accepts
          });
        }
        return source;
      }
    }
  },
  streamSetup = {
    stream: {}, 
    lastEventId: 0,
    isNative: false,
    history:  {},
    options:  {}
  },
  isNative    = window.EventSource ? true : false 
  ;

  $.extend({
    eventsource: function ( options ) {
      
      var stream, _options;

      //  PLUGIN sUB FUNCTION
      if ( options && !$.isPlainObject(options) && pluginFns.public[options] ) {
        //  IF NO LABEL WAS PASSED, SEND MESSAGE TO ALL STREAMS
        return pluginFns.public[options](  
                  arguments[1] ?
                    arguments[1]  :
                    '*'
                );
      }
      
      //  IF PARAMS WERE PASSED IN AS AN OBJECT, NORMALIZE TO A QUERY STRING
      options.data    = options.data && $.isPlainObject(options.data) ? 
                          $.param(options.data) : 
                          options.data;      
      
      //  Mimick the native behavior?
      if ( !options.url || typeof options.url !== 'string'  ) {
        throw new SyntaxError('Not enough arguments: Must provide a url');
      }
      
      
      //  IF NO EXPLICIT LABEL, SET INTERNAL LABEL
      options.label   = !options.label ? 
                          options.url + '?' + options.data : 
                          options.label;
      
      
      //  CREATE NEW OPTIONS OBJECT
      _options        = $.extend({}, streamDefaults, options);
      
      //  CREATE EMPTY OBJECT IN `streamCache`
      streamCache[_options.label] = {
        options: _options
      };
      
      
      //  DETERMINE AND DECLARE `stream`
      stream  = !isNative ?
                  //  IF NOT NATIVE, OPEN A POLLING FALLBACK
                  pluginFns._private.openPollingSource(_options) :
                  new EventSource(_options.url + ( _options.data ? '?' + _options.data : '' ) );

      //  ADD TO EVENT SOURCES
      streamCache[_options.label] = $.extend({}, streamSetup, {
        stream: stream, 
        isNative: isNative, 
        options: _options
      });
      
      
      if ( isNative ) {
        pluginFns._private.openEventSource(_options);
      }
      
      return streamCache;
    }
  });

})(jQuery);