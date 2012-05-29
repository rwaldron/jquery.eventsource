/*!
 * jQuery.EventSource (jQuery.eventsource)
 *
 * Copyright (c) 2011 Rick Waldron
 * Dual licensed under the MIT and GPL licenses.
 */

(function( jQuery, global ) {

	jQuery.extend( jQuery.ajaxSettings.accepts, {
		stream: "text/event-stream"
	});

	var stream = {

		defaults: {
			// Stream identity
			label: null,
			url: null,

			// Event Callbacks
			open: jQuery.noop,
			message: jQuery.noop
		},
		setup: {
			stream: {},
			lastEventId: 0,
			isHostApi: false,
			retry: 500,
			history: {},
			options: {}
		},
		cache: {}
	},

	pluginFns	 = {

		public: {
			close: function( label ) {

				var tmp = {};

				if ( !label || label === "*" ) {
					for ( var prop in stream.cache ) {
						if ( stream.cache[ prop ].isHostApi ) {
							stream.cache[ prop ].stream.close();
						}
					}

					stream.cache = {};

					return stream.cache;
				}

				for ( var prop in stream.cache ) {
					if ( label !== prop ) {
						tmp[ prop ] = stream.cache[ prop ];
					} else {
						if ( stream.cache[ prop ].isHostApi ) {
							stream.cache[ prop ].stream.close();
						}
					}
				}

				stream.cache = tmp;

				return stream.cache;
			},
			streams: function( label ) {

				if ( !label || label === "*" ) {
					return stream.cache;
				}

				return stream.cache[ label ] || {};
			}
		},
		_private: {

			// Open a host api event source
			openEventSource: function( options ) {
				var label = options.label;

				stream.cache[ label ].stream.addEventListener("open", function(event) {
					if ( stream.cache[ label ] ) {

						this.label = label;

						stream.cache[ label ].options.open.call(this, event);
					}
				}, false);

				stream.cache[label].stream.addEventListener("message", function(event) {

					var streamData = [];

					if ( stream.cache[ label ] ) {

						streamData[ streamData.length ] = jQuery.parseJSON( event.data );

						this.label = label;

						stream.cache[ label ].lastEventId = +event.lastEventId;
						stream.cache[ label ].history[stream.cache[ label ].lastEventId] = streamData;
						stream.cache[ label ].options.message.call(this, streamData[0] ? streamData[0] : null, {
							data: streamData,
							lastEventId: stream.cache[ label ].lastEventId
						}, event);

						// TODO: Add custom event triggering
					}
				}, false);

				return stream.cache[ label ].stream;
			},
			// open fallback event source
			openPollingSource: function( options ) {
				var label = options.label,
					source;

				if ( stream.cache[ label ] ) {

					source = jQuery.ajax({
						type: "GET",
						url: options.url,
						data: options.data,
						beforeSend: function() {
							if ( stream.cache[ label ] ) {
								this.label = label;
								stream.cache[ label ].options.open.call( this );
							}
						},
						success: function( data ) {

							var tempdata,
								label = options.label,
								parsedData = [],
								streamData = jQuery.map( data.split("\n\n"), function(sdata, i) {
									return !!sdata && sdata;
								}),
								idx = 0, length = streamData.length,
								rretryprefix = /retry/,
								retries;

							if ( jQuery.isArray( streamData ) ) {

								for ( ; idx < length; idx++ ) {

									if ( streamData[ idx ] ) {

										if ( rretryprefix.test( streamData[ idx ] ) &&
													(retries = streamData[ idx ].split("retry: ")).length ) {

											if ( retries.length === 2 && !retries[ 0 ] ) {

												stream.cache[ label ].retry = stream.cache[ label ].options.retry = +retries[ 1 ];
											}

										} else {
											tempdata = streamData[ idx ].split("data: ")[ 1 ];

											// Convert `dataType` here
											if ( options.dataType === "json" ) {
												tempdata = jQuery.parseJSON( tempdata );
											}

											parsedData[ parsedData.length ] = tempdata;
										}
									}
								}
							}

							if ( stream.cache[ label ] ) {

								this.label = label;

								stream.cache[ label ].lastEventId++;
								stream.cache[ label ].history[ stream.cache[ label ].lastEventId ] = parsedData;
								stream.cache[ label ].options.message.call(this, parsedData[0] ? parsedData[0] : null, {
									data: parsedData,
									lastEventId: stream.cache[ label ].lastEventId
								});

								setTimeout(
									function() {
										pluginFns._private.openPollingSource.call( this, options );
									},
									// Use server sent retry time if exists or default retry time if not
									( stream.cache[ label ] && stream.cache[ label ].retry ) || 500
								);
							}
						},
						cache: false,
						timeout: 50000
					});
				}
				return source;
			}
		}
	},
	isHostApi = global.EventSource ? true : false;

	jQuery.eventsource = function( options ) {

		var streamType, opts;

		// Plugin sub function
		if ( options && !jQuery.isPlainObject( options ) && pluginFns.public[ options ] ) {
			// If no label was passed, send message to all streams
			return pluginFns.public[ options ](
								arguments[1] ?
									arguments[1] :
									"*"
							);
		}

		// If params were passed in as an object, normalize to a query string
		options.data = options.data && jQuery.isPlainObject( options.data ) ?
										jQuery.param( options.data ) :
										options.data;

		// Mimick the host api behavior?
		if ( !options.url || typeof options.url !== "string"	) {
			throw new SyntaxError("Not enough arguments: Must provide a url");
		}


		// If no explicit label, set internal label
		options.label = !options.label ?
												options.url + "?" + options.data :
												options.label;


		// Create new options object
		opts = jQuery.extend({}, stream.defaults, options);

		// Create empty object in `stream.cache`
		stream.cache[ opts.label ] = {
			options: opts
		};


		// Determine and declare `event stream` source,
		// whether will be host api or XHR fallback
		streamType = !isHostApi ?
								// If not host api, open a polling fallback
								pluginFns._private.openPollingSource(opts) :
								new EventSource(opts.url + ( opts.data ? "?" + opts.data : "" ) );

		// Add to event sources
		stream.cache[ opts.label ] = jQuery.extend({}, stream.setup, {
			stream: streamType,
			isHostApi: isHostApi,
			options: opts
		});


		if ( isHostApi ) {
			pluginFns._private.openEventSource(opts);
		}

		return stream.cache;
	};

	jQuery.each( [ "close", "streams" ], function( idx, name ) {
		jQuery.eventsource[ name ] = function( arg ) {
			return jQuery.eventsource( name, arg || "*" );
		};
	});

})(jQuery, window);
