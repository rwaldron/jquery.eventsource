<?php
/*
  this is for demo purposes, a real-life example should take into account
  user input sanitization
*/

$GLOBALS['YAK']  = array(
  'cmd'   => $_POST['cmd'],
  'list'  => json_decode(file_get_contents('yakyak-online.json'))
);

if ( sizeof($_POST) > 0 ) {
  foreach($_POST as $k => $v ) {
    $_POST[$k]  = htmlentities($v);
  }
}

if ( $GLOBALS['YAK']['cmd'] === 'join' ) {

  $flag = false;
  
  foreach($GLOBALS['YAK']['list'] as $_list) {
    
    if ( $_list->id === $_POST['id'] ) {
      $flag = true;
    }
  }
  
  if ( !$flag ) {
  
    $temp = new stdClass();
    $temp->id         = $_POST['id'];
    $temp->screenName = $_POST['screenName'];
    $temp->avatar     = $_POST['avatar'];


    array_push($GLOBALS['YAK']['list'], $temp);
    file_put_contents('yakyak-online.json', json_encode($GLOBALS['YAK']['list']));
  }
}

if ( $GLOBALS['YAK']['cmd'] === 'quit' ) {
  $temp = array();
  
  foreach($GLOBALS['YAK']['list'] as $_list) {
    
    if ( $_list->id !== $_POST['id'] ) {
      array_push($temp, $_list);
    }
  }
  
  $GLOBALS['YAK']['list'] = $temp;
  file_put_contents('yakyak-online.json', json_encode($GLOBALS['YAK']['list']));
}





header("Content-Type: text/event-stream\n\n");

echo 'data: ' . json_encode($GLOBALS['YAK']['list']);
exit;
?>