<?php
header("Content-Type: text/event-stream\n\n");

// despite not having the while(true){}
// this seems to repeat pushing messages to the client
echo 'data: ' . json_encode(
                  array(
                    0 => array( 
                      'time' => time(), 
                      'message' => 'Some kind of foo'
                    ), 
                    1 => array( 
                      'time' => time(), 
                      'message' => 'Some kind of quux' 
                    )
                  )
                ) . "\n";

?>