var Yak  = {
  Twttr: {}
};

$(function () {
  
  var $article      = $('article'), 
      $footer       = $('footer');
  
  $article.filter(':first').css({
    width:  $('#container').width(),
    height: '500px',
    background: 'white'
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
            'html':  ( message.avatar ? '<img src="'+message.avatar+'"> ' : '' ) + message.from + ' : ' + message.message
          }).appendTo('ul#yak-messages-ul');
          
          $article.scrollTop($('ul').height());
        }
      });
      //$.eventsource('close', 'yakyak-messages');
    }
  });
  
  $('form').submit(function (e) {
    e.preventDefault();
    // do an ajax post
    var messageStr  = $('#yak-message').val();
    
    $('#yak-message').val('');
    
    $.ajax({
      url: 'yakyak-messages.php', 
      type: 'POST',
      dataType: 'json',
      data: $.param({
                'yak-message'  : messageStr, 
                'yak-from'     : Yak.Twttr.screenName,
                'yak-avatar'   : Yak.Twttr.profileImage
            }), 
      success: function (data) {
        //placeholder
      }
    })
  });
  
  
  $.eventsource({
    label:    'yakyak-currentusers',
    url:      'yakyak-currentusers.php',
    dataType: 'json',
    message:  function (data) {
    
      if ( data ) {
        // this is stupid, change to check if exists
        $('ul#yak-currentusers-ul').empty();

        $.each(data, function (i, user) {
        
          console.log(user);
          
          $('<li/>', {
            'data-id': user.id,
            'html':  '<img src="'+user.avatar+'"> ' + user.screenName
          }).appendTo('ul#yak-currentusers-ul');
        });
        //$.eventsource('close', 'yakyak-currentusers');
      }        
    }
  });  
  
  $('#yak-message').trigger('focus');
  
  $('#hint').hide();
  
  $('section,footer').hover(function() {
    $('#hint').show();
  }, function () {
    $('#hint').hide();
  });
  
  $footer.css({
    opacity: 0
  });
  
});