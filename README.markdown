# jQuery.EventSource


Gives developers the power of the EventSource API across browsers. Uses the EventSource constructor when natively available 
and falls back to Ajax polling logic when it's not. 


## Usage

    $.eventsource({
      
      // Assign a label to this event source
      
      label:    'event-source-label', 

      //  Set the file to receive data from the server

      url:      'event-sources/server-event-source.php',
      
      //  Set the type of data you expect to be returned
      //  text, json supported
      
      dataType: 'json', 
      
      //  Set a callback to fire when the event source is opened
      //  `onopen`
      open:  function (data) {

        console.group('$.eventsource() - Example 1 : TEXT open callback');
          console.log( 'opened' );
          console.log(data);
        console.groupEnd('$.eventsource() - Example 1 : TEXT open callback');

      },

      //  Set a callback to fire when a message is received
      //  `onmessage`
      message:  function (data) {


        console.group('$.eventsource() - Example 1 : TEXT message callback');
          console.log( 'message received' );
          console.log(data);
        console.groupEnd('$.eventsource() - Example 1 : TEXT message callback');
      }
    });
    
    
    //  Close event sources by label name
    
    $.eventsource('close', 'event-source-label');
    

## Varied Content Type Usage

    
    // PLAIN TEXT EXAMPLE - NO CONTENT TYPE GIVEN
    $.eventsource({
      label:    'text-event-source',
      url:      'test-event-sources/text-event-source.php',
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
      url:      'test-event-sources/text-event-source-ct.php',
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
      url:      'test-event-sources/json-event-source.php',
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
    

## Accessing your current event sources:
    
    //  Returns an object containing all the currently active eventsource streams
    $.eventsource('streams')

    
## Server Source Requirements
    
    //  Server response MUST be Content-Type: text/event-stream
    //  Server response MUST be prepended with 'data: '

    
    // Examples:
    
    //  PHP
    header("Content-Type: text/event-stream\n\n");
    echo 'data: this is a valid response';
    
    
    //  Python
    print "Content-Type: text/event-stream"
    print "data: this is a valid response"

    
    







