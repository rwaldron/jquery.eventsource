$(function(){
  
  test("$.eventsource", function() {
    
    ok( $.isFunction($.eventsource), "$.eventsource is a function" );


    $.eventsource({
      label:    'json-event-source',
      url:      '../test-event-sources/event-source-2.php',
      dataType: 'json',
      open:  function () {
        ok( true, "$.eventsource fires onopen callback" );
      },
      message:  function (data) {
        
        ok( true, "$.eventsource fires onmessage callback" );
        
        ok( data, "$.eventsource returns data");
        
        $.eventsource('close', 'json-event-source');
      }
    });

    asyncTest("$.eventsource onmessage tests", function() {
      setTimeout(function(){
        start();
      }, 13);
    });  
  });

});