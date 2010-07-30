# jQuery.EventSource


## Usage

    $.eventsource({

      //  SET THE FILE TO RECEIVE DATA FROM THE SERVER

      url:      'test-event-sources/event-source-1.php',

      //  SET A CALLBACK TO FIRE WHEN THE EVENT SOURCE IS OPENED
      //  `onopen`
      open:  function (data) {

        console.group('$.eventsource() - Example 1 : TEXT open callback');
          console.log( 'opened' );
          console.log(data);
        console.groupEnd('$.eventsource() - Example 1 : TEXT open callback');

      },

      //  SET A CALLBACK TO FIRE WHEN A MESSAGE IS RECEIVED
      //  `onmessage`
      message:  function (data) {


        console.group('$.eventsource() - Example 1 : TEXT message callback');
          console.log( 'message received' );
          console.log(data);
        console.groupEnd('$.eventsource() - Example 1 : TEXT message callback');
      }
    });
