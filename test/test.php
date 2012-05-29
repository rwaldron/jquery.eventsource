<?php

$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : '';

if ($action == 'stream') {
	//set event handler
	header("Content-Type: text/event-stream");
	header('Cache-Control: no-cache'); // recommended to prevent caching of event data.
	ob_implicit_flush(true);
	//ini_set('output_buffering', 'off');
	for ($i=1;$i<50;$i++) {
		echo 'data: '  . $i . "\n\n";
		ob_flush();
		flush();

		sleep(1);
	}
	//exit();
} else {
?>

<!DOCTYPE html>
<html>
	<head>
	<title>jQuery.eventsource.js</title>
	<script src="http://code.jquery.com/jquery-latest.js"></script>
	<script src="../jquery.eventsource.js"></script>
	<script>
	$(document).ready(function(){
			$.eventsource({
				label: "event-source-label",
				url: "test.php?action=stream",
				dataType: "text",
				message: function(data) {
					console.log( data + "<br>" );

				}
			});
	})
	</script>
  </head>
<body></body>
</html>
<?php
}