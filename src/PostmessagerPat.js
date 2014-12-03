(function() {

	/**
	 * Function.bind polyfill
	 * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
	 */
	if (!Function.prototype.bind) {
		Function.prototype.bind = function(oThis) {
			if (typeof this !== 'function') {
				// closest thing possible to the ECMAScript 5
				// internal IsCallable function
				throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
			}

			var aArgs = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP = function() {},
				fBound = function() {
					return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
						aArgs.concat(Array.prototype.slice.call(arguments)));
				};

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}

	/**
	 * Basic event attaching
	 * @param {Object} el      Window or DOM element
	 * @param {String} eve     Name of the event
	 * @param {Function} handler Function to be triggered
	 */
	function addEvent(el, eve, handler) {
		if (el.addEventListener) {
			return el.addEventListener(eve, handler);
		}
		return el.attachEvent("on" + eve, handler);
	}

	function is( obj ){
		return Object.prototype.toString.call( obj )
										.replace(/\[object ([\w]+)\]/i, "$1")
										.toLowerCase();
	}

	/**
	 * Basic event removing
	 * @param  {Object} el      Window or DOM element
	 * @param  {String} eve     Name of the event
	 * @param  {Function} handler Function to be triggered
	 */
	function removeEvent(el, eve, handler) {
		if (el.removeEventListener) {
			return el.removeEventListener(eve, handler);
		}
		return el.detachEvent("on" + eve, handler);
	}



	function PostmessagerPat() {

		this._hook = function(e) {

			var i = -1;
			var len = 0;
			var id = null;
			var origin = e.origin;

			if( this.origins.hasOwnProperty( origin ) &&
					this.origins[ origin ].length > 0 ){
				i = -1;
				len = this.origins[ origin ].length;
				while( ++i < len ){
					id = this.origins[ origin ][ i ];
					this._ids[ id ].handler( e );
				}
			}

			if( this.origins.hasOwnProperty( "*" ) &&
					this.origins["*"].length > 0 ){
				i = -1;
				len = this.origins["*"].length;
				while( ++i < len ){
					id = this.origins[ "*" ][ i ];
					this._ids[ id ].handler( e );
				}
			}

		}.bind(this);
		this._ids = {};

		this.origins = {};

		addEvent(window, "message", this._hook);

	}
	PostmessagerPat.prototype = {

		"constructor": PostmessagerPat,

		"destroy": function() {
			var key = null;
			for( key in this._ids ){
				this._ids[ key ] = null;
			}
			this._ids = null;
			for( key in this.origins ){
				this.origins[ key ].length = 0;
				this.origins[ key ] = null;
			}
			this.origins = null;
			removeEvent(window, "message", this._hook);
			this._hook = null;
		},

		"publish": function( win, origin, data ) {

			if( is( origin ) === "array" ){
				var i = -1;
				var len = origin.length;
				while( ++i < len ){
					win.postMessage( data, origin[ i ] );
				}
			} else {
				win.postMessage( data, origin );
			}

		},

		"subscribe": function( origin, handler ) {

			var id = PostmessagerPat.UUID++;

			this._ids[ id ] = {
				"handler": handler,
				"origins": origin
			};

			if( is( origin ) === "array" ){
				var i = -1;
				var len = origin.length;
				var orig = null;
				while( ++i < len ){
					orig = origin[ i ];
					if( !this.origins.hasOwnProperty( orig ) ){
						this.origins[ orig ] = [];
					}
					this.origins[ orig ].push( id );
				}
			} else {
				if( !this.origins.hasOwnProperty( origin ) ){
					this.origins[ origin ] = [];
				}
				this.origins[ origin ].push( id );
			}

			return id;
		},

		"unsubscribe": function( id ) {

			var len = -1;
			var domainIndex = -1;

			if( typeof id === "string" ){
				
				// Quit early if we have no domains with that id
				if( !this.origins.hasOwnProperty( id ) ){ return; }

				var handlerId = null;
				domainIndex = -1;
				len = this.origins[ id ].length;
				while( len-- ){
					handlerId = this.origins[ id ][ len ];
					domainIndex = this._ids[ handlerId ].origins.indexOf( id );
					this._ids[ handlerId ].origins.splice( domainIndex, 1 );
					// Handler has no more domains so remove it
					if( this._ids[ handlerId ].origins.length === 0 ){
						this._ids[ handlerId ] = null;
						delete this._ids[ handlerId ];
					}
				}

				return;
			}

			var origin = "";
			len = this._ids[ id ].origins.length;
			while( len-- ){
				origin = this._ids[ id ].origins[ len ];
				domainIndex = this.origins[ origin ].indexOf( id );
				this.origins[ origin ].splice( domainIndex, 1 );
			}
			this._ids[ id ].origins = null;
			delete this._ids[ id ];

		}

	};
	PostmessagerPat.UUID = 0;

	window.PostmessagerPat = PostmessagerPat;

})();