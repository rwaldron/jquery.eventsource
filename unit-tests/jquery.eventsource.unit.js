
function sizeOf(obj) {
  var length = 0;
  for ( var prop in  obj ) {
    length++;
  }
  return length;
}

var streams;

$(function(){
  
  
  
  test("$.eventsource is a function", function() {
    ok( $.isFunction($.eventsource), "$.eventsource is a function" );
  });
  
  test("$.eventsource callbacks", function() {  
    
    stop();
    // PLAIN TEXT EXAMPLE - NO CONTENT TYPE GIVEN
    $.eventsource({
      label:    'text-event-source',
      url:      '../test-event-sources/event-source-1.php',
      open:  function () {
        ok( true, "#1 $.eventsource fires onopen callback" );
      },
      message:  function (data) {
        ok( true, "#1 $.eventsource fires onmessage callback" );
        
        ok( data, "#1 $.eventsource returns data");
        
        ok( typeof $.eventsource('close', 'text-event-source') === 'object', '$.eventsource("close", "text-event-source") must return an object' );        
      }
    });

    // PLAIN TEXT EXAMPLE - HAS CONTENT TYPE
    $.eventsource({
      label:    'text-event-source-ct',
      url:      '../test-event-sources/event-source-1.php',
      dataType: 'text',
      open:  function () {
        ok( true, "#2 $.eventsource fires onopen callback" );
      },
      message:  function (data) {
        ok( true, "#2 $.eventsource fires onmessage callback" );
        
        ok( data, "#2 $.eventsource returns data");
        
        ok( typeof $.eventsource('close', 'text-event-source-ct') === 'object', '$.eventsource("close", "text-event-source-ct") must return an object' );        
      }
    });
    
    // PLAIN TEXT EXAMPLE - HAS CONTENT TYPE

    $.eventsource({
      label:    'json-event-source',
      url:      '../test-event-sources/event-source-2.php',
      dataType: 'json',
      open:  function () {
        ok( true, "#3 $.eventsource fires onopen callback" );
      },
      message:  function (data) {
        
        ok( true, "#3 $.eventsource fires onmessage callback" );
        
        ok( data, "#3 $.eventsource returns data");

        ok( typeof $.eventsource('close', 'json-event-source') === 'object', '$.eventsource("close", "json-event-source") must return an object' );        
      }
    });

    setTimeout(function(){
      start();
    }, 500);
  });
  
  
  test("$.eventsource streams Are Closed", function() {
    
    stop();
    
    equals(sizeOf($.eventsource('streams')), 0, 'there are 0 active streams');
    
    ok( typeof $.eventsource('streams') === 'object', '$.eventsource("streams") must return an object' );        


    setTimeout(function(){
      start();
    }, 500);
    
  });
  
  

  test("$.eventsource open/close", function() {
    stop();
    
    $.eventsource({
      label:    'json-event-source-stream',
      url:      '../test-event-sources/event-source-2.php',
      dataType: 'json',
      open:  function () {
        ok( true, "#4 $.eventsource fires onopen callback" );
      },
      message:  function (data) {
        
        ok( true, "#4 $.eventsource fires onmessage callback" );
        
        ok( data, "#4 $.eventsource returns data");
        
        equals(sizeOf($.eventsource('streams')), 1, 'there is only 1 active stream');
        
        ok( typeof $.eventsource('close', 'json-event-source-stream') === 'object', '$.eventsource("close", "json-event-source-stream") must return an object' );        
        
        equals(sizeOf($.eventsource('streams')), 0, 'there are 0 active streams');
      }
    });


    
    setTimeout(function(){ 
      start(); 
    }, 500);    
    
  });  


  test("$.eventsource - multiple concurrent sources - scope tests", function() {
    stop();
    
    $.eventsource({
      label:    'event-source-1',
      url:      '../test-event-sources/event-source-2.php',
      dataType: 'json',
      open:  function () {
        
        ok( true, "event-source-1 fires onopen callback" );
      },
      message:  function (data) {
        
        equals(this.label, 'event-source-1', 'Correct EventSource returned, looking for `event-source-1`');
        ok( true, "event-source-1 fires onmessage callback" );
      }
    });
    
    $.eventsource({
      label:    'event-source-2',
      url:      '../test-event-sources/event-source-2.php',
      dataType: 'json',
      open:  function () {
        
        ok( true, "event-source-2 fires onopen callback" );
      },
      message:  function (data) {
        
        equals(this.label, 'event-source-2', 'Correct EventSource returned, looking for `event-source-2`');
        ok( true, "event-source-2 fires onmessage callback" );
      }
    });

    $.eventsource({
      label:    'event-source-3',
      url:      '../test-event-sources/event-source-2.php',
      dataType: 'json',
      open:  function () {
        ok( true, "event-source-3 fires onopen callback" );
      },
      message:  function (data) {
        
        
        equals(this.label, 'event-source-3', 'Correct EventSource returned, looking for `event-source-3`');
        ok( true, "event-source-3 fires onmessage callback" );
      }
    });   


    setTimeout(function(){ 
      start(); 
    }, 500);       
  });  
  
  
  
  test("$.eventsource - multiple concurrent sources - scope tests: closing sources one at a time", function() {
    stop();
    
    
    setTimeout(function() {
      equals(sizeOf($.eventsource('close', 'event-source-1')), 2, 'Closing `event-source-1`, 2 event sources remaining');
      start();
    }, 200);      


  
    setTimeout(function() {
      equals(1, sizeOf($.eventsource('close', 'event-source-2')), 'Closing `event-source-2`, 1 event sources remaining ');
      start();
    }, 300);      

    
    setTimeout(function() {
      equals(0, sizeOf($.eventsource('close', 'event-source-3')), 'Closing `event-source-3`, 0 event sources remaining');
      start();
    }, 400);      


    
    setTimeout(function(){ 
       
      equals(0, sizeOf($.eventsource('streams')), 'All Event Sources closed');
      start();
    }, 500);  
  });    
  

  test("$.eventsource - breakage tests", function() {

    try {
      $.eventsource({});    
      
    } catch(err)  {
      ok(true, 'Caught the error thrown by the instance not having any options set');
    }        
    
    try {
      $.eventsource({
        open:  function () {},
        message:  function (data) {}
      });       
    } catch(err)  {
      ok(true, 'Caught the error thrown by the instance not being provided a url');
    }    

    try {
      $.eventsource({
        url: null,
        open:  function () {},
        message:  function (data) {}
      });       
    } catch(err)  {
      ok(true, 'Caught the error thrown by the instance options.url being `null`');
    }    


    try {
      $.eventsource({
        url: undefined,
        open:  function () {},
        message:  function (data) {}
      });       
    } catch(err)  {
      ok(true, 'Caught the error thrown by the instance options.url being `undefined`');
    }    


    try {
      $.eventsource({
        url: '',
        open:  function () {},
        message:  function (data) {}
      });       
    } catch(err)  {
      ok(true, 'Caught the error thrown by the instance options.url being an empty string');
    }    


    try {
      $.eventsource({
        url: false,
        open:  function () {},
        message:  function (data) {}
      });       
    } catch(err)  {
      ok(true, 'Caught the error thrown by the instance options.url being `false`');
    }    


    try {
      $.eventsource({
        url: true,
        open:  function () {},
        message:  function (data) {}
      });       
    } catch(err)  {
      ok(true, 'Caught the error thrown by the instance options.url being `true`');
    }    

    
    
    // this will error, but not testing?
    $.eventsource({
      label:    'event-source-3',
      url:      '../test-event-sources/event-source-10.php',
      dataType: 'json',
      open:  function () {},
      message:  function (data) {}
    });   
        
    

  });    
});



  
test("$.eventsource ignores incorrect server response prefix", function() {  
  stop();
  
  var isignored = true, 
      isopened  = false;
  
  $.eventsource({
    label:    'text-event-source',
    url:      '../test-event-sources/event-source-5.php',
    open:  function () {
      isopened  = true;
    },
    message:  function (data) {
      isignored = false;
    }
  });


  setTimeout(function(){
    
    /*
    var stream  = $.eventsource('stream', 'text-event-source');
    
    if ( !stream.isNative ) {
      ok(isopened, 'open the event source');
    } else {
      ok(!isopened, 'open the event source');
    }
    */
    
    ok(isignored, 'However, server responses missing the response prefix will be ignored');
    
    start();
  }, 2000);
  
  
  
  
  ok( typeof $.eventsource('close', 'text-event-source') === 'object', '$.eventsource("close") must return an object' );
});



test("$.eventsource streams object", function() {  
  
  stop();
  
  setTimeout(function(){
    // labeled stream
    $.eventsource({
      label:    'labeled-stream',
      url:      '../test-event-sources/event-source-1.php',
      open:  function () {
      },
      message:  function (data) {
      }
    });

    // unlabeled stream
    $.eventsource({
      url:      '../test-event-sources/event-source-2.php',
      open:  function () {
      },
      message:  function (data) {
      }
    });
  
  
    var streamsObj  = $.eventsource('streams');
    
    ok( typeof streamsObj === 'object', '$.eventsource("streams") must return an object' );
    
    
    $.each(streamsObj, function (i, obj) {

      ok( typeof obj.isNative === 'boolean', 'Stream.options.isNative exists and is a boolean value' );

      ok( typeof obj.lastEventId === 'number', 'Stream.options.isNative exists and is a boolean value' );
    
      ok( obj.options.label && obj.options.label !== '', 'Stream.options.label exists and not an empty string' );

      ok( obj.options.message && $.isFunction(obj.options.message), 'Stream.options.message exists and is a function' );

      ok( obj.options.open && $.isFunction(obj.options.open), 'Stream.options.message exists and is a function' );
      
      
      if ( obj.isNative ) {
        ok( (obj.stream.toString() === '[object EventSource]'), 'Native Streams are [object EventSource]'  );
      } 
      
      if ( !obj.isNative ) {
        if ( window.XMLHttpRequest ) {
          ok( (obj.stream.toString() === '[object XMLHttpRequest]'), 'Non-Native Streams are [object XMLHttpRequest]'  );
        }
        else {
          ok( true, 'Missing IE Stream type test!!'  );
        }
      }
    
    });
    
    ok( typeof $.eventsource('close') === 'object', '$.eventsource("close") must return an object' );
    
    ok( typeof $.eventsource('streams') === 'object', '$.eventsource("streams") must return an object' );
    
    start();

  }, 5000);
});
