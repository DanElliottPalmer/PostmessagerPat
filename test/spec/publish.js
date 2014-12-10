module("Publish");

test( "", function( assert ){

	assert.expect(1);

	var pp = new PostmessagerPat();
	var done = assert.async();
	var frame = document.getElementById("frameChild");
	var tmr = null;

	var testData = Math.random();

	pp.subscribe( "http://localhost", function( e ){
		assert.equal( testData, e.data );
		clearTimeout( tmr ) && ( tmr = null );
		complete();
	} );

	addEvent( frame, "load", onFrameLoad );
	frame.src = "./frames/publish.html";

	function complete(){
		pp.destroy();
		pp = null;
		done();
	}

	function onFrameLoad(){
		removeEvent( frame, "load", onFrameLoad );
		pp.publish( frame.contentWindow, "http://localhost", testData );
		tmr = setTimeout( timeout, 500 );
	}

	function timeout(){
		assert.ok( false );
		done();
	}

} );