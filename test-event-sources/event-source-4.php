<?php
header("Content-Type: text/event-stream\n\n");

echo 'data: ' . json_encode($_GET) . "\n";
?>