<?php
header("Content-Type: text/event-stream\n\n");

// despite not having the while(true){}
// this seems to repeat pushing messages to the client
echo 'data: ' . time() . "\n";
?>