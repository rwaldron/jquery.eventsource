
function sizeOf(obj) {
  var length = 0;
  for ( var prop in  obj ) {
    length++;
  }
  return length;
}

$(function(){
  
  
  
  test("$.eventsource", function() {
    
    var streams;
    
    ok( $.isFunction($.eventsource), "$.eventsource is a function" );



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

    asyncTest("$.eventsource onmessage tests", function() {
      setTimeout(function(){
        start();
      }, 100);
    }); 
  });
  

  test("$.eventsource('streams')", function() {
    
    

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
        
        streams = $.eventsource('streams');
        
        
        equals(1, sizeOf($.eventsource('streams')), 'there is only 1 active stream');
        
            
        
        $.eventsource('close', 'json-event-source-stream');
        
        
        equals(0, sizeOf($.eventsource('streams')), 'there are 0 active streams');
        
      }
    });

    setTimeout(function(){ 
      

      start(); 
      
      
    
    }, 500);    
  });  
  
});