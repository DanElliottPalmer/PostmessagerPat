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


	/**
	 * PostmessagerPat class
	 * @global
	 * @class
	 */
	function PostmessagerPat() {

		/**
		 * One listener to rule them all
		 * @type {Function}
		 * @protected
		 * @param  {Object}  eventData  Event data
		 */
		this._hook = function( eventData ) {

			var i = -1;
			var len = 0;
			var id = null;
			var origin = eventData.origin;

			if( this.origins.hasOwnProperty( origin ) &&
					this.origins[ origin ].length > 0 ){
				i = -1;
				len = this.origins[ origin ].length;
				while( ++i < len ){
					id = this.origins[ origin ][ i ];
					this._ids[ id ].handler( eventData );
				}
			}

			if( this.origins.hasOwnProperty( "*" ) &&
					this.origins["*"].length > 0 ){
				i = -1;
				len = this.origins["*"].length;
				while( ++i < len ){
					id = this.origins[ "*" ][ i ];
					this._ids[ id ].handler( eventData );
				}
			}

		}.bind(this);

		/**
		 * Stores the ids of the listeners
		 * @type {Object}
		 * @protected
		 */
		this._ids = {};

		/**
		 * Stores the current origins we are allowing
		 * @type {Object}
		 */
		this.origins = {};

		addEvent(window, "message", this._hook);

	}
	PostmessagerPat.prototype = {

		"constructor": PostmessagerPat,

		/**
		 * Clears internal objects and removes the window listener
		 */
		"destroy": function() {
			var key = null;

			/**
			 * Clear the listeners
			 */
			for( key in this._ids ){
				this._ids[ key ] = null;
			}
			this._ids = null;

			/**
			 * Clear the origins
			 */
			for( key in this.origins ){
				this.origins[ key ].length = 0;
				this.origins[ key ] = null;
			}
			this.origins = null;

			/**
			 * Remove our window listener
			 */
			removeEvent(window, "message", this._hook);
			this._hook = null;
		},

		/**
		 * Sends the information using postMessage
		 * @param  {Object} win    The window to post to
		 * @param  {String|Array.<String>} origin Origin(s) to post to
		 * @param  {*} data   The data that will be posted to the window
		 */
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

		/**
		 * Adds a listener internally looking out for data from specified origins
		 * @param  {String|Array.<String>} origin  Origin(s) to accept from
		 * @param  {Function} handler Callback to be triggered when data comes through
		 * @return {Number}         UID/Index of this subscriber
		 */
		"subscribe": function( origin, handler ) {

			var id = PostmessagerPat.UID++;

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

		/**
		 * Removes an internal listener based on its UID or domain
		 * @param  {Number|String} id The UID of the handler or domain you wish to
		 *                            remove handlers from
		 */
		"unsubscribe": function( id ) {

			var len = -1;
			var domainIndex = -1;

			if( typeof id === "string" ){
				
				/**
				 *  Quit early if we have no domains with that id
				 */
				if( !this.origins.hasOwnProperty( id ) ){ return; }

				var handlerId = null;
				domainIndex = -1;
				len = this.origins[ id ].length;

				while( len-- ){

					handlerId = this.origins[ id ][ len ];
					domainIndex = this._ids[ handlerId ].origins.indexOf( id );
					this._ids[ handlerId ].origins.splice( domainIndex, 1 );
					
					/**
					 * Check if handler has no more domains, if so remove it
					 */
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

	/**
	 * Unique ID for the listener
	 * @type {Number}
	 */
	PostmessagerPat.UID = 0;

	window.PostmessagerPat = PostmessagerPat;

})();