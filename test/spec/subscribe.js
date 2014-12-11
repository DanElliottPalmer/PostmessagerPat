module("Subscribe");

test( "Single domain", function( assert ){

	assert.expect( 1 );

	var pp = new PostmessagerPat();
	var done = assert.async();
	var tmr = null;
	var frame = document.getElementById("frameChild");

	pp.subscribe( ALLOWED_ORIGIN, function( e ){
		clearTimeout( tmr ) && ( tmr = null );
		assert.equal( e.data, "true" );
		complete();
	} );

	addEvent( frame, "load", onFrameLoad );
	frame.src = "./frames/subscribe.html";

	function complete(){
		removeEvent( frame, "load", onFrameLoad );
		pp.destroy();
		pp = null;
		done();
	}

	function onFrameLoad(){
		removeEvent( frame, "load", onFrameLoad );
		tmr = setTimeout(function(){
			assert.ok(false);
			complete();
		},500);
	}

} );

test( "Multiple domains", function( assert ){

	assert.expect( 1 );

	var pp = new PostmessagerPat();
	var done = assert.async();
	var tmr = null;
	var frame = document.getElementById("frameChild");

	pp.subscribe( [ ALLOWED_ORIGIN, "http://random" ], function( e ){
		assert.equal( e.data, "true" );
		clearTimeout( tmr ) && ( tmr = null );
		complete();
	} );

	addEvent( frame, "load", onFrameLoad );
	frame.src = "./frames/subscribe.html";

	function complete(){
		removeEvent( frame, "load", onFrameLoad );
		pp.destroy();
		pp = null;
		done();
	}

	function onFrameLoad(){
		removeEvent( frame, "load", onFrameLoad );
		tmr = setTimeout(function(){
			assert.ok(false);
			complete();
		},500);
	}

} );