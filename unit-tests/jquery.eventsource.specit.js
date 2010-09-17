
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

  after(function() {
    streams = {};
  });
  
  
  it("$.eventsource stream object", function() {
    streams[labelfor].should(include, 'history');
    streams[labelfor].should(include, 'isNative');
    streams[labelfor].should(include, 'lastEventId');
    streams[labelfor].should(include, 'options');
    streams[labelfor].should(include, 'stream');
  });
  
  it("$.eventsource stream object should be", function() {
    streams[labelfor].isNative.should(beA, Boolean);
    streams[labelfor].history.should(beAn, Object);
    streams[labelfor].options.should(beAn, Object);
    streams[labelfor].stream.should(beA, stypeOf);
    streams[labelfor].lastEventId.should(beA, Number);
  });
  
  
  it("$.eventsource stream options object", function() {
    streams[labelfor].options.should(include, 'url');
    streams[labelfor].options.should(include, 'label');
    streams[labelfor].options.should(include, 'accepts');
    streams[labelfor].options.should(include, 'message');
    streams[labelfor].options.should(include, 'open');
  });    

  it("$.eventsource stream options object should be", function() {    
    streams[labelfor].options.url.should(beA, String);
    streams[labelfor].options.label.should(beAn, String);
    streams[labelfor].options.accepts.should(beAn, Object);
    streams[labelfor].options.message.should(beA, Function);
    streams[labelfor].options.open.should(beA, Function);
  });  
  
  /*
  it("$.eventsource stream close", function() {    
    console.log(streams[labelfor].options.label);
    $.eventsource('close', streams[labelfor].options.label);
    console.log($.eventsource('streams'));
  });  
  

  it("$.eventsource streams", function() {
    streams.should(beSimilarTo, {});
  });
  */
});