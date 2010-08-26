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


if ( isset($_POST['yak-message']) ) {
  
  foreach($_POST as $k => $v ) {
    $_POST[$k]  = htmlentities($v);
  }


  $last = $GLOBALS['YAK']['chat'][sizeof($GLOBALS['YAK']['chat'])-1];
  $temp = new stdClass();
  
  $temp->id        = $last->id+1;
  $temp->from      = $_POST['yak-from']; 
  $temp->message   = $_POST['yak-message']; 
  $temp->avatar    = $_POST['yak-avatar']; 
  $temp->timestamp = time(); 
     
  array_push($GLOBALS['YAK']['chat'], $temp);
  
  
  
  $exp  = explode(' ', $_POST['yak-message']);
  $test = $exp[0];

  if ( in_array($test, $GLOBALS['YAK']['bot']['commands']) )  {
    
    // for now, we just have one command...for fun.
    $bot = new stdClass();

    $bot->id        = $last->id+2;
    $bot->from      = 'Ghostbusters'; 
    $bot->avatar    = 'http://thumbs1.ebaystatic.com/pict/3602347119806464_1.jpg';
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