module("Origin");

test( "Allowed origin", function( assert ){
	assert.expect(1);

	var pp = new PostmessagerPat();
	var done = assert.async();
	var frame = document.getElementById("frameChild");
	var tmr = null;

	pp.subscribe( [ "http://otherplace.co.uk", ALLOWED_ORIGIN ] , function( e ){
		if( e.origin === ALLOWED_ORIGIN ){
			assert.ok(true);
			clearTimeout( tmr ) && ( tmr = null );
			complete();
		}
	} );

	addEvent( frame, "load", onFrameLoad );
	frame.src = "./frames/origin.html";

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

test( "Disallowed origin", function( assert ){
	assert.expect(1);
	
	var pp = new PostmessagerPat();
	var done = assert.async();
	var frame = document.getElementById("frameChild");
	var tmr = null;

	pp.subscribe( [ "http://otherplace.co.uk" ] , function( e ){
		assert.ok(false);
		clearTimeout( tmr ) && ( tmr = null );
		complete();
	} );

	addEvent( frame, "load", onFrameLoad );
	frame.src = "./frames/origin.html";

	function complete(){
		removeEvent( frame, "load", onFrameLoad );
		pp.destroy();
		pp = null;
		done();
	}

	function onFrameLoad(){
		removeEvent( frame, "load", onFrameLoad );
		tmr = setTimeout(function(){
			assert.ok(true);
			complete();
		},500);
	}

} );