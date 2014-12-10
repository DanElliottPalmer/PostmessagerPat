module("Unsubscribe");

test( "Listener ID", function( assert ){

	assert.expect( 1 );

	var pp = new PostmessagerPat();
	var frame = document.getElementById("frameChild");
	var done = assert.async();

	var id = pp.subscribe( "http://localhost", function( e ){

		assert.ok( true );
		pp.unsubscribe( id );

		frame.src = "";
		frame.src = "./frames/unsubscribe.html";

		setTimeout( complete, 500 );

	} );

	frame.src = "./frames/unsubscribe.html";

	function complete(){
		pp.destroy();
		pp = null;
		done();
	}

} );

test( "Domain", function( assert ){

	assert.expect( 1 );

	var pp = new PostmessagerPat();
	var frame = document.getElementById("frameChild");
	var done = assert.async();

	pp.subscribe( "http://localhost", function( e ){

		assert.ok( true );
		pp.unsubscribe( "http://localhost" );

		frame.src = "";
		frame.src = "./frames/unsubscribe.html";

		setTimeout( complete, 500 );

	} );

	frame.src = "./frames/unsubscribe.html";

	function complete(){
		pp.destroy();
		pp = null;
		done();
	}

} );