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

test( "Target frame", function( assert ){

	assert.expect( 1 );

	var pp = new PostmessagerPat();
	var done = assert.async();
	var tmr = null;
	var frame = document.getElementById("frameChild");

	pp.subscribe( ALLOWED_ORIGIN, function( e ){
		assert.equal( e.data, "true" );
		clearTimeout( tmr ) && ( tmr = null );
		complete();
	}, frame.contentWindow );

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

test( "Disallowed frame", function( assert ){

	assert.expect( 1 );

	var pp = new PostmessagerPat();
	var done = assert.async();
	var tmr = null;
	var frame = document.getElementById("frameChild");
	var disallowedFrame = document.getElementById("frameDisallowed");

	pp.subscribe( ALLOWED_ORIGIN, function( e ){
		assert.ok(false);
		clearTimeout( tmr ) && ( tmr = null );
		complete();
	}, frame.contentWindow );

	addEvent( disallowedFrame, "load", onFrameLoad );
	disallowedFrame.src = "./frames/subscribe.html";

	function complete(){
		removeEvent( disallowedFrame, "load", onFrameLoad );
		pp.destroy();
		pp = null;
		done();
	}

	function onFrameLoad(){
		removeEvent( disallowedFrame, "load", onFrameLoad );
		tmr = setTimeout(function(){
			assert.ok(true);
			complete();
		},500);
	}

} );