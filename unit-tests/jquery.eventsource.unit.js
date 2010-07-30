
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
  
  
  test("$.eventsource('streams') Are Closed", function() {
    
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
  
});