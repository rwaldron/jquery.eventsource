$(function () {
  
  var Pictor {
    api: {
      url:'http://ajax.googleapis.com/ajax/services/search/web'
    },
    history: {
      store: function (term) {
      
      },
      retrieve: function () {
      
      }
    }
  }, 
  //  cache
  $term = $('#term')
  ;    
  
  
  
  
  $.ajax({
    url: Pictor.api.url,
    data: { v: '1.0', q: $term.val() }, 
    function (data) {
      
      console.log(data);
    
    },
    dataType: 'jsonp'      
  });





  $term.trigger('focus');
}); 