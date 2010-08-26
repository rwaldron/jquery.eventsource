var _Twttr  = {};

$(function () {
  
  var $article      = $('article');
  
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
          }).appendTo('ul');
          
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
                'yak-from'     : _Twttr.screenName,
                'yak-avatar'   : _Twttr.profileImage
            }), 
      success: function (data) {
        //placeholder
      }
    })
  
  });
  
  $('#yak-message').trigger('focus');
  
  $('#hint').hide();
  
  $('section,footer').hover(function() {
    $('#hint').show();
  }, function () {
    $('#hint').hide();
  });
  
  $('footer').hide();
  
});