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
