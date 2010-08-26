
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
        
        $.eventsource('close', 'text-event-source');
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
        
        $.eventsource('close', 'text-event-source-ct');
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

        $.eventsource('close', 'json-event-source');
      }
    });

    setTimeout(function(){
      start();
    }, 500);
  });
  
  
  test("$.eventsource streams Are Closed", function() {
    
    stop();
    
    equals(sizeOf($.eventsource('streams')), 0, 'there are 0 active streams');

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
        
        $.eventsource('close', 'json-event-source-stream');
        
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



  
test("$.eventsource incorrect server response prefix", function() {  
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
    ok(isopened, 'We successfully opened the event source');
    ok(isignored, 'However, server responses missing the response prefix will be ignored');
    
    start();
  }, 2000);
});

