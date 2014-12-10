module("Subscribe");

test( "Single domain", function( assert ){

	assert.expect( 1 );

	var pp = new PostmessagerPat();
	var done = assert.async();
	var tmr = null;

	pp.subscribe( "http://localhost", function( e ){
		assert.equal( e.data, true );
		clearTimeout( tmr ) && ( tmr = null );
		complete();
	} );

	document.getElementById("frameChild").src = "./frames/subscribe.html";

	function complete(){
		pp.destroy();
		pp = null;
		done();
	}

	function onFrameLoad(){
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

	pp.subscribe( [ "http://localhost", "http://random" ], function( e ){
		assert.equal( e.data, true );
		clearTimeout( tmr ) && ( tmr = null );
		complete();
	} );

	document.getElementById("frameChild").src = "./frames/subscribe.html";

	function complete(){
		pp.destroy();
		pp = null;
		done();
	}

	function onFrameLoad(){
		tmr = setTimeout(function(){
			assert.ok(false);
			complete();
		},500);
	}

} );