
function sizeOf(obj) {
  var length = 0;
  for ( var prop in  obj ) {
    length++;
  }
  return length;
}


$(function() {

  var params = location.search.slice( 1 ).split( "&" ), 
    pairs = {};

  $.each( params, function(idx, param) {

    var tmp = param.split("=");

    pairs[ tmp[0] ] = tmp[1];
  });

  if ( pairs.nospecit ) {
    $("iframe").hide();
  }
});


test("is a function", function() {

  expect(7);
  
  ok( jQuery.eventsource, "exists" );
  equal( typeof jQuery.eventsource, "function", "jQuery.eventsource() is a Function" );
  
  ok( jQuery.eventsource.streams, "jQuery.eventsource.streams exists" );
  equal( typeof jQuery.eventsource.streams, "function", "jQuery.eventsource.streams() is a Function" );

  ok( jQuery.eventsource.close, "jQuery.eventsource.close exists" );
  equal( typeof jQuery.eventsource.close, "function", "jQuery.eventsource.close() is a Function" );

  equal( sizeOf( jQuery.eventsource.streams() ), 0, "There are no streams");

});
  
test("callbacks", function() {  
  
  var expects = 12, 
    count = 0;

  expect( expects );
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }

  function okPlus() { 
    ok.apply(null, arguments);
    plus();
  }

  stop();
  // PLAIN TEXT EXAMPLE NO CONTENT TYPE GIVEN
  jQuery.eventsource({
    label: "text-event-source",
    url: "../test-event-sources/event-source-1.php",
    open: function() {
      okPlus( true, "#1 fires onopen callback" );
    },
    message: function(data) {
      okPlus( true, "#1 fires onmessage callback" );
      
      okPlus( data, "#1 returns data");
      
      okPlus( typeof jQuery.eventsource("close", "text-event-source") === "object", 'jQuery.eventsource("close", "text-event-source") must return an object' );        
    }
  });

  // PLAIN TEXT EXAMPLE HAS CONTENT TYPE
  jQuery.eventsource({
    label: "text-event-source-ct",
    url: "../test-event-sources/event-source-1.php",
    dataType: "text",
    open: function() {
      okPlus( true, "#2 fires onopen callback" );
    },
    message: function(data) {

      okPlus( true, "#2 fires onmessage callback" );
      okPlus( data, "#2 returns data");
      okPlus( typeof jQuery.eventsource("close", "text-event-source-ct") === "object", 'jQuery.eventsource("close", "text-event-source-ct") must return an object' );        

    }
  });
  
  // PLAIN TEXT EXAMPLE HAS CONTENT TYPE

  jQuery.eventsource({
    label: "json-event-source",
    url: "../test-event-sources/event-source-2.php",
    dataType: "json",
    open: function() {
      okPlus( true, "#3 fires onopen callback" );
    },
    message: function(data) {

      okPlus( true, "#3 fires onmessage callback" );
      okPlus( data, "#3 returns data");
      okPlus( typeof jQuery.eventsource("close", "json-event-source") === "object", 'jQuery.eventsource("close", "json-event-source") must return an object' );        

    }
  });

});

test("open/close", function() {
  var expects = 5,
    count = 0;

  expect( expects );

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  stop();

  jQuery.eventsource({
    label: "json-event-source-stream",
    url: "../test-event-sources/event-source-2.php",
    dataType: "json",
    open: function() {
      ok( true, "fires onopen callback" );
      plus();
    },
    message: function(data) {

      ok( true, "fires onmessage callback" );
      plus();

      ok( data, "returns data");
      plus();

      equal( typeof jQuery.eventsource.close("json-event-source-stream"), "object", 'jQuery.eventsource.close("json-event-source-stream") must return an object' );
      plus();

      equal( sizeOf( jQuery.eventsource.streams() ), 0, "there are 0 active streams");
      plus();
    }
  });
});


test("multiple concurrent sources scope tests", function() {
  var expects = 12, 
    count = 0, 
    down = 3;

  expect( expects );

  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }

  stop();

  jQuery.each( [ 1, 2, 3 ], function( idx, stream ) {

    jQuery.eventsource({
      label: "event-source-" + stream ,
      url: "../test-event-sources/event-source-2.php",
      dataType: "json",
      open: function() {

        ok( true, "Stream #" + stream + ", event-source-" + stream + " fires onopen callback" );
        plus();
      },
      message: function(data) {

        equal(this.label, "event-source-" + stream, "Stream #" + stream + ", Correct EventSource returned, looking for `event-source-" + stream + "`");
        plus();

        ok( true, "Stream #" + stream + ", event-source-" + stream + " fires onmessage callback" );
        plus();

        jQuery.eventsource.close( "event-source-" + stream );

        equal( sizeOf( jQuery.eventsource.streams() ), --down, "Stream #" + stream + " is closed" );
        plus();
      }
    });
  });
});

test("breakage tests", function() {

  var expects = 7, 
    count = 0;

  expect( expects );
  
  function plus() { 
    if ( ++count === expects ) {
      start();
    }
  }

  function okPlus() { 
    ok.apply(null, arguments);
    plus();
  }




  stop();

  try {
    jQuery.eventsource({});

  } catch(err) {
    okPlus(true, "Caught the error thrown by the instance not having any options set");
  }

  try {
    jQuery.eventsource({
      open: function() {},
      message: function(data) {}
    });
  } catch(err)  {
    okPlus(true, "Caught the error thrown by the instance not being provided a url");
  }

  try {
    jQuery.eventsource({
      url: null,
      open: function() {},
      message: function(data) {}
    });
  } catch(err) {
    okPlus(true, "Caught the error thrown by the instance options.url being `null`");
  }


  try {
    jQuery.eventsource({
      url: undefined,
      open: function() {},
      message: function(data) {}
    });
  } catch(err) {
    okPlus(true, "Caught the error thrown by the instance options.url being `undefined`");
  }


  try {
    jQuery.eventsource({
      url: "",
      open: function() {},
      message: function(data) {}
    });
  } catch(err)  {
    okPlus(true, "Caught the error thrown by the instance options.url being an empty string");
  }


  try {
    jQuery.eventsource({
      url: false,
      open: function() {},
      message: function(data) {}
    });
  } catch(err) {
    okPlus(true, "Caught the error thrown by the instance options.url being `false`");
  }


  try {
    jQuery.eventsource({
      url: true,
      open: function() {},
      message: function(data) {}
    });
  } catch(err) {
    okPlus(true, "Caught the error thrown by the instance options.url being `true`");
  }
});

test("streams object", function() {  

  var expects = 13,
    count = 0;

  expect( expects );

  function plus() {
    if ( ++count === expects ) {
      start();
    }
  }

  // labeled stream
  jQuery.eventsource({
    label: "labeled-stream",
    url: "../test-event-sources/event-source-1.php",
    open: function() {
    },
    message: function(data) {
    }
  });

  // unlabeled stream
  jQuery.eventsource({
    url: "../test-event-sources/event-source-2.php",
    open: function() {
    },
    message: function(data) {
    }
  });

  // no callbacks
  jQuery.eventsource({
    url: "../test-event-sources/event-source-2.php"
  });

  stop(5000);

  var streamsObj  = jQuery.eventsource.streams();



  ok( typeof streamsObj === "object", "jQuery.eventsource('streams') must return an object" );
  plus();

  jQuery.each( streamsObj, function(i, obj) {

    equal( typeof obj.isHostApi, "boolean", "Stream.isHostApi exists and is a boolean value" );
    plus();

    equal( typeof obj.lastEventId, "number", "Stream.lastEventId exists and is a boolean value" );
    plus();

    equal( obj.options.label && obj.options.label !== "", true, "Stream.options.label exists and not an empty string" );
    plus();

    equal( obj.options.message && jQuery.isFunction(obj.options.message), true, "Stream.options.message exists and is a function" );
    plus();

    equal( obj.options.open && jQuery.isFunction(obj.options.open), true, "Stream.options.message exists and is a function" );
    plus();


    if ( obj.isHostApi ) {
      equal( obj.stream.toString(), "[object EventSource]",  "Native Streams are [object EventSource]"  );
      plus();
    } else {
      equal( obj.stream.toString(), "[object Object]",  "Non-Native Streams are [object Object]"  );
      plus();
    }
  });

});


test("settable retry time in ms", function() {

  var expects = 2,
    count = 0,
    stream;

  expect( expects );

  function plus() {
    if ( ++count === expects ) {
      jQuery.eventsource.close();
      start();
    }
  }

  stop();

  // labeled stream
  jQuery.eventsource({
    label: "retry-stream",
    url: "../test-event-sources/event-source-retry.php",
    dataType: "json",
    message: function() {

      var stream = jQuery.eventsource.streams("retry-stream"),
      streamretry = jQuery.eventsource.streams("retry-stream").retry;

      if ( !stream.isHostApi ) {
        equal( streamretry, 1000, "jQuery.eventsource.streams('retry-stream') has a retry time of 1000ms" );
      } else {
        ok( true, "retry time is managed by the implementation when provided from a server message" );
      }
      plus();
    }
  });
});


test("streams Are Closed", function() {

  var expects = 2, 
    count = 0;

  expect( expects );
  
  function plus() { 
    if ( ++count === expects ) {
      start(); 
    }
  }

  stop();

  jQuery.eventsource.close();
  
  equal(sizeOf(jQuery.eventsource.streams()), 0, "there are 0 active streams");
  plus();

  ok( typeof jQuery.eventsource.streams() === "object", 'jQuery.eventsource.streams() must return an object' );        
  plus();
});
