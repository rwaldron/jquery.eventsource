$(function () {
  
  var $containersec = $('#container,section'), 
      $window       = $(window), 
      $article      = $('article');
  

  $containersec.width(
    $window.width()
  );

  $article.filter(':first').css({
    height: '600px',
    background: 'white'
  });

  $window.bind('resize', function () {
    $containersec.width(
      $window.width()
    );
  });
  
  $('input:submit').css({
    display:'none'
  });
  
  
  $.eventsource({
    label:    'yakyak-messages',
    url:      'yakyak-messages.php',
    dataType: 'json',
    message:  function (data) {
      
      var dataMessageId = $('li').length ? $('li:last').attr('data-message-id') : 0 ;
      
      $.each(data, function (i, message) {
        if ( message.id > dataMessageId ) {
          $('<li/>', {
            'data-message-id': message.id,
            'text': message.message
          }).appendTo('ul');
        }
        
        $('article').scrollTop($('article').height());
      });
      //console.log(data);
      
      //$.eventsource('close', 'yakyak-messages');
    }
  });
  
  $('form').submit(function (e) {
    e.preventDefault();
    // do an ajax post
    var messageStr  = $('#jz-message').val();
    
    $('#jz-message').val('');
    
    $.ajax({
      url: 'yakyak-messages.php', 
      type: 'POST',
      dataType: 'json',
      data: $.param({
                'jz-message'  : messageStr, 
                'jz-from'     : 'rick'//temp 
            }), 
      success: function (data) {
        //console.log(data);
      }
    })
  
  });
  
  
  $('jz-message').trigger('focus');
  
});