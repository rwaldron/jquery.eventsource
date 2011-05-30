
function sizeOf(obj) {
  var length = 0;
  for ( var prop in  obj ) {
    length++;
  }
  return length;
}


describe("jQuery.EventSource", function() {
  var streams = {}, labelfor, stypeOf;

  before(function() {
    labelfor  = 'text-event-source';
    stypeOf   = window.EventSource  ? EventSource : XMLHttpRequest;
    streams   = $.eventsource({
      label:    labelfor,
      url:      '../test-event-sources/event-source-1.php'
    });
  });




  it("$.eventsource streams cache", function() {
    assert($.eventsource('streams')).should(beAn, Object);
    assert(sizeOf($.eventsource('streams'))).should(beLessThanOrEqualTo, 1);
  });

  
  it("$.eventsource stream object", function() {
    assert(streams[labelfor]).should(include, 'history');
    assert(streams[labelfor]).should(include, 'isHostApi');
    assert(streams[labelfor]).should(include, 'lastEventId');
    assert(streams[labelfor]).should(include, 'options');
    assert(streams[labelfor]).should(include, 'stream');
  });
  
  it("$.eventsource stream object should be", function() {
  
    
    assert(streams[labelfor].isHostApi).should(beA, Boolean);
    assert(streams[labelfor].history).should(beAn, Object);
    assert(streams[labelfor].options).should(beAn, Object);
    //assert(streams[labelfor].stream).should(beA, stypeOf);
    assert(streams[labelfor].lastEventId).should(beA, Number);
  });
  
  
  it("$.eventsource stream options object", function() {
    assert(streams[labelfor].options).should(include, 'url');
    assert(streams[labelfor].options).should(include, 'label');
    assert(streams[labelfor].options).should(include, 'message');
    assert(streams[labelfor].options).should(include, 'open');
  });    

  it("$.eventsource stream options object should be", function() {    
    assert(streams[labelfor].options.url).should(beA, String);
    assert(streams[labelfor].options.label).should(beAn, String);
    //assert(streams[labelfor].options.accepts).should(beAn, Object);
    assert(streams[labelfor].options.message).should(beA, Function);
    assert(streams[labelfor].options.open).should(beA, Function);
  });  


  it("$.eventsource stream closing", function() {    
    
    $.eventsource('close', labelfor);
  
    assert($.eventsource('streams')).should(beAn, Object);
    assert(sizeOf($.eventsource('streams'))).should(beLessThanOrEqualTo, 0);
  });  



  after(function() {
    streams = {};
  });

});