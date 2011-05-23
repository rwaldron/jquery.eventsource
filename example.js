$(function () {
  
  //  USE CASES/EXAMPLES 
  //  ROUGHING OUT THE API
  

  
  // PLAIN TEXT EXAMPLE - NO CONTENT TYPE GIVEN
  $.eventsource({
    label:    'text-event-source',
    url:      'test-event-sources/event-source-1.php',
    open:  function () {
      console.group('$.eventsource() - Example 1 : TEXT open callback');
        console.log( 'opened' );

      console.groupEnd('$.eventsource() - Example 1 : TEXT open callback');
    },
    message:  function (data) {
      console.group('$.eventsource() - Example 1 : TEXT message callback');
        console.log( 'message received' );
        console.log(data);
      console.groupEnd('$.eventsource() - Example 1 : TEXT message callback');
      
      $.eventsource('close', 'text-event-source');
    }
  });
  
  // PLAIN TEXT EXAMPLE - HAS CONTENT TYPE
  $.eventsource({
    label:    'text-event-source-ct',
    url:      'test-event-sources/event-source-1.php',
    dataType: 'text',
    open:  function () {
      console.group('$.eventsource() - Example 2 : TEXT open callback');
        console.log( 'opened' );

      console.groupEnd('$.eventsource() - Example 2 : TEXT open callback');
    },
    message:  function (data) {
      console.group('$.eventsource() - Example 2 : TEXT message callback');
        console.log( 'message received' );
        console.log(data);
      console.groupEnd('$.eventsource() - Example 2 : TEXT message callback');
      
      $.eventsource('close', 'text-event-source-ct');
    }
  });


  // JSON EXAMPLE - HAS CONTENT TYPE
  $.eventsource({
    label:    'json-event-source',
    url:      'test-event-sources/event-source-2.php',
    dataType: 'json',
    open:  function () {
      console.group('$.eventsource() - Example 3 : JSON open callback');
        console.log( 'opened' );
  
      console.groupEnd('$.eventsource() - Example 3 : JSON open callback');
    },
    message:  function (data) {
      console.group('$.eventsource() - Example 3 : JSON message callback');
        console.log( 'message received' );
        console.log(data);
      console.groupEnd('$.eventsource() - Example 3 : JSON message callback');
      
      
      $.eventsource('close', 'json-event-source');
    }
  });



});