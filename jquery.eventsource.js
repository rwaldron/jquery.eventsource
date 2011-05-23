/*!
 * jQuery Event Source
 * 
 * Copyright (c) 2011 Rick Waldron
 * Dual licensed under the MIT and GPL licenses.
 */

(function( jQuery, global ) {

  jQuery.extend( jQuery.ajaxSettings.accepts, {
    stream: "text/event-stream"
  });  
  
  var stream  = {
  
    defaults: {
      // Stream identity
      label: null,
      url: null,

      // Event Callbacks
      open: jQuery.noop,
      message: jQuery.noop
    },
    setup: {
      stream: {}, 
      lastEventId: 0,
      isNative: false,
      history: {},
      options: {}
    },
    cache: {}
  },

  pluginFns   = {

    public: {
      close: function ( label ) {

        var cache = {};
        
        if ( label !== "*" ) {

          for ( var prop in stream.cache ) {
            if ( label  !== prop ) {
              cache[ prop ] = stream.cache[ prop ];
            }
          }
        }

        stream.cache = cache;

        return stream.cache;
      }, 
      streams: function ( label ) {

        if ( label === "*" ) {
          return stream.cache;
        }

        return stream.cache[ label ] || {};
      }
    },
    _private: {


      //  Open a native event source 
      openEventSource: function ( options ) {
        var label = options.label;

        stream.cache[ label ].stream.addEventListener("open", function (event) {
          if ( stream.cache[label] ) {
          
            this["label"]  = label;
            
            stream.cache[label].options.open.call(this, event);
          }   
        }, false);


        stream.cache[label].stream.addEventListener("message", function (event) {

          if ( stream.cache[label] ) {

            var streamData  = [];

            streamData[ streamData.length ] = jQuery.parseJSON( event.data );

            this["label"]  = label;

            stream.cache[label].lastEventId = +event.lastEventId;
            stream.cache[label].history[stream.cache[label].lastEventId]  = streamData;
            stream.cache[label].options.message.call(this, streamData[0] ? streamData[0] : null, {
              data: streamData,
              lastEventId: stream.cache[label].lastEventId
            }, event);
          }
        }, false);

        return stream.cache[label].stream;
      }, 
      // open fallback event source
      openPollingSource: function ( options ) {
        var label = options.label;
        
        if ( stream.cache[label] ) {
        
          var source  = jQuery.ajax({
            type: "GET",
            url: options.url,
            data: options.data,
            beforeSend: function () {
              if ( stream.cache[label] ) {
                
                this["label"] = label;
                stream.cache[label].options.open.call( this );
              }   
            },
            success: function ( data ) {

              var tempdata,
              		label = options.label,
                  parsedData = [],
                  streamData = jQuery.map( data.split("\n"), function(sdata, i) {
                                  if ( sdata ) {
                                    return sdata;
                                  }
                                });

              if ( jQuery.isArray(streamData) ) {
              
                for ( var i = 0; i < streamData.length; i++ ) {

                  tempdata  = streamData[i].split("data: ")[1];

                  // Convert `dataType` here
                  if ( options.dataType === "json" ) {
                    tempdata  = JSON.parse( tempdata );
                  }

                  parsedData[ parsedData.length ] = tempdata;
                }
              }

              if ( stream.cache[label] ) {

                this["label"] = label;

                stream.cache[label].lastEventId++;
                stream.cache[label].history[stream.cache[label].lastEventId]  = parsedData;
                stream.cache[label].options.message.call(this, parsedData[0] ? parsedData[0] : null, {
                  data: parsedData,
                  lastEventId: stream.cache[label].lastEventId
                });


                setTimeout(
                  function () {
                    pluginFns._private.openPollingSource.call( this, options );
                  },
                  // matches speed of native EventSource
                  500
                );
              }
            },
            cache: false,
            timeout: 50000
          });
        }
        return source;
      }
    }
  },
  isNative = global.EventSource ? true : false;

  jQuery.eventsource = function( options ) {

    var streamType, opts;

    //  Plugin sub function
    if ( options && !jQuery.isPlainObject( options ) && pluginFns.public[ options ] ) {
      //  If no label was passed, send message to all streams
      return pluginFns.public[ options ](  
                arguments[1] ?
                  arguments[1] :
                  "*"
              );
    }

    //  If params were passed in as an object, normalize to a query string
    options.data = options.data && jQuery.isPlainObject( options.data ) ? 
                        jQuery.param( options.data ) :
                        options.data;

    //  Mimick the native behavior?
    if ( !options.url || typeof options.url !== "string"  ) {
      throw new SyntaxError("Not enough arguments: Must provide a url");
    }


    //  If no explicit label, set internal label
    options.label = !options.label ? 
                        options.url + "?" + options.data : 
                        options.label;


    //  Create new options object
    opts = jQuery.extend({}, stream.defaults, options);

    //  Create empty object in `stream.cache`
    stream.cache[ opts.label ] = {
      options: opts
    };


    //  Determine and declare `stream`
    streamType = !isNative ?
                //  If not native, open a polling fallback
                pluginFns._private.openPollingSource(opts) :
                new EventSource(opts.url + ( opts.data ? "?" + opts.data : "" ) );

    //  ADd to event sources
    stream.cache[ opts.label ] = jQuery.extend({}, stream.setup, {
      stream: streamType, 
      isNative: isNative, 
      options: opts
    });


    if ( isNative ) {
      pluginFns._private.openEventSource(opts);
    }

    return stream.cache;
  };


})(jQuery, window);
