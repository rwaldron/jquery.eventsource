<?php
header("Content-Type: text/event-stream\n\n");

// despite not having the while(true){}
// this seems to repeat pushing messages to the client
echo 'data: ' . json_encode(
                  array(
                    0 => array( 'time' => time(), 
                                'message' => 'data stream 1 - some data'), 
                    1 => array( 'time' => time(), 
                                'message' => 'data stream 1 - some data'),
                  )
                ) . "\n";

echo 'data: ' . json_encode(
                  array(
                    0 => array( 'time' => time(), 
                                'message' => 'data stream 2 - some data'), 
                    1 => array( 'time' => time(), 
                                'message' => 'data stream 2 - some data'),
                  )
                ) . "\n";                
?>