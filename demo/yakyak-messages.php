<?php
/*
  this is for demo purposes, a real-life example should take into account
  user input sanitization
*/

$GLOBALS['YAK']  = array(
  'bot'   => array(
    'commands'  =>  array('?gb'),
    'messages'  =>  json_decode(file_get_contents('yakyak-bot.json'))
  ),
  'chat'  => json_decode(file_get_contents('yakyak-chat.json'))
);


if ( isset($_POST['jz-message']) ) {

  $last = $GLOBALS['YAK']['chat'][sizeof($GLOBALS['YAK']['chat'])-1];
  $temp = new stdClass();
  
  $temp->id        = $last->id+1;
  $temp->from      = $_POST['jz-from']; 
  $temp->message   = $_POST['jz-message']; 
  $temp->timestamp = time(); 
     
  array_push($GLOBALS['YAK']['chat'], $temp);
  
  
  
  $exp  = explode(' ', $_POST['jz-message']);
  $test = $exp[0];

  if ( in_array($test, $GLOBALS['YAK']['bot']['commands']) )  {
    
    // for now, we just have one command...for fun.
    $bot = new stdClass();

    $bot->id        = $last->id+2;
    $bot->from      = 'bot'; 
    $bot->message   = $GLOBALS['YAK']['bot']['messages'][rand(0, sizeof($GLOBALS['YAK']['bot']['messages']))]->message; 
    $bot->timestamp = time(); 

    array_push($GLOBALS['YAK']['chat'], $bot);
  
  }
  
  file_put_contents('yakyak-chat.json', json_encode($GLOBALS['YAK']['chat']));
}


header("Content-Type: text/event-stream\n\n");

echo 'data: ' . json_encode($GLOBALS['YAK']['chat']);
exit;
?>