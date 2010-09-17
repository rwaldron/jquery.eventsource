//http://dev.twitter.com/anywhere/begin
$(function () {
  
  var $container  = $('#container'), 
      $connector  = $('#twitter-connect-placeholder'), 
      $footer     = $('footer');
  
  twttr.anywhere(function (T) {
    

    T.linkifyUsers();  

    
    Yak.Twttr.toggleChatForm   = function (val) {
      if ( val === 1 && $('footer').css('opacity') === 1 ) {
        return;
      }
      
      $('footer').animate({
        opacity: val
      }, 'med', function () {

        $('#yak-message').trigger('focus');

      });
    };
    
    Yak.Twttr.toggleConnectLinks = function (val) {
      
      if ( val === 'off' && $('#twitter-connect-signout').length ) {
        $('#twitter-connect-signout').remove();
        return;
      }
      
      $connector.append('<a href="#" id="twitter-connect-signout">Log Out</a>');

      $('#twitter-connect-signout').click(function (e) {
        e.preventDefault();
        twttr.anywhere.signOut();
      });
    };

    Yak.Twttr.setLoggedInVals   = function (T, fn) {
      Yak.Twttr.currentUser    = T.currentUser;
      Yak.Twttr.screenName     = Yak.Twttr.currentUser.data('screen_name');
      Yak.Twttr.profileImage   = Yak.Twttr.currentUser.data('profile_image_url');
      
      fn && $.isFunction(fn) && fn();
      
    };
    
    Yak.Twttr.updateCurrentUsers = function (cmd) {
    
      
      $.ajax({
        url: 'yakyak-currentusers.php', 
        type: 'POST', 
        data: $.param({
          'id' : Yak.Twttr.currentUser.data('id'), 
          'screenName' : Yak.Twttr.currentUser.data('screen_name'),
          'avatar' : Yak.Twttr.currentUser.data('profile_image_url'), 
          'cmd': cmd
        }), 
        dataType: 'json', 
        success: function (data) {
          //console.log(data); 
        }
      });    
    };
    


    T('#twitter-connect-placeholder').connectButton();
    

    T.bind('authComplete', function (e, user) {
      Yak.Twttr.setLoggedInVals(T, function () {
        Yak.Twttr.updateCurrentUsers('join');
      });
      Yak.Twttr.toggleChatForm(1);
      Yak.Twttr.toggleConnectLinks();
    });

    T.bind('signOut', function (e) {
      Yak.Twttr.updateCurrentUsers('quit');    
      
      
      Yak.Twttr.toggleChatForm(0);
      Yak.Twttr.toggleConnectLinks('off');
    });

    if (  T.isConnected() ) {
      Yak.Twttr.toggleChatForm(1);
      Yak.Twttr.toggleConnectLinks('on');
      
      Yak.Twttr.setLoggedInVals(T, function () {
        Yak.Twttr.updateCurrentUsers('join');
      });
      
    }
  });


  if ( $('#container').css('margin-right') === '0px' ) {
    $('#twitter-connect-placeholder').css({
      right: $(window).width() - ( $container.position().left + $container.width() )
    });
  
  } else {
    $('#twitter-connect-placeholder').css({ 
      right: $('#container').css('margin-right') 
    });
  }
  
});