module("Publish");

test( "", function( assert ){

	assert.expect(1);

	var pp = new PostmessagerPat();
	var done = assert.async();
	var frame = document.getElementById("frameChild");
	var tmr = null;

	var testData = Math.random();

	pp.subscribe( ALLOWED_ORIGIN, function( e ){
		clearTimeout( tmr ) && ( tmr = null );
		assert.equal( testData, e.data );
		complete();
	} );

	addEvent( frame, "load", onFrameLoad );
	frame.src = "./frames/publish.html";

	function complete(){
		removeEvent( frame, "load", onFrameLoad );
		pp.destroy();
		pp = null;
		done();
	}

	function onFrameLoad(){
		removeEvent( frame, "load", onFrameLoad );
		tmr = setTimeout( timeout, 1000 );
		pp.publish( frame.contentWindow, ALLOWED_ORIGIN, testData );
	}

	function timeout(){
		assert.ok( false );
		complete();
	}

} );