<?php
header("Content-Type: text/event-stream\n\n");
// no `data: ` given - should throw errors
echo json_encode($_GET) . "\n";
?>
