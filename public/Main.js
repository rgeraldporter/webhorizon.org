var Main = (function () { 'use strict';

var template = (function () {

    return {
        data () {
            return {
                email: 'rob@weeverapps.com'
            };
        }
    }
}());

let addedCss = false;
function addCss () {
	var style = createElement( 'style' );
	style.textContent = "\n    \n    .main[svelte-1470151360], [svelte-1470151360] .main {\n        padding: 1em;\n    }\n";
	appendNode( style, document.head );

	addedCss = true;
}

function renderMainFragment ( root, component ) {
	var div = createElement( 'div' );
	setAttribute( div, 'svelte-1470151360', '' );
	div.className = "main";
	
	var h1 = createElement( 'h1' );
	setAttribute( h1, 'svelte-1470151360', '' );
	
	appendNode( h1, div );
	appendNode( createText( "WebHorizon.org: Coming soon" ), h1 );
	appendNode( createText( "\n\n    " ), div );
	
	var p = createElement( 'p' );
	setAttribute( p, 'svelte-1470151360', '' );
	
	appendNode( p, div );
	appendNode( createText( "Get notified when new web browsers & and major/minor development versions of browsers are released." ), p );
	appendNode( createText( "\n\n    " ), div );
	
	var h3 = createElement( 'h3' );
	setAttribute( h3, 'svelte-1470151360', '' );
	
	appendNode( h3, div );
	appendNode( createText( "What this service will be for..." ), h3 );
	appendNode( createText( "\n\n    " ), div );
	
	var p1 = createElement( 'p' );
	setAttribute( p1, 'svelte-1470151360', '' );
	
	appendNode( p1, div );
	appendNode( createText( "Testing browser features before they are released is important to anyone developing sofisticated web applications that use newer frameworks and newer features. This might include: GPS, push notifications, mobile device integrations such as cameras, and offline functionalities." ), p1 );
	appendNode( createText( "\n\n    " ), div );
	
	var p2 = createElement( 'p' );
	setAttribute( p2, 'svelte-1470151360', '' );
	
	appendNode( p2, div );
	appendNode( createText( "Because so many of these features are new, they can evolve quickly and browser makers often make decisions that affect existing implementations. For example, in 2016, Google Chrome began to force SSL upon websites requesting GPS usage, breaking many web applications. They warned about this coming long in advance, but there's no great way to warn developers in advance outside of making blog and email listserv announcements and hoping everyone finds out." ), p2 );
	appendNode( createText( "\n\n    " ), div );
	
	var p3 = createElement( 'p' );
	setAttribute( p3, 'svelte-1470151360', '' );
	
	appendNode( p3, div );
	appendNode( createText( "Right now there are no services to sign up for to find out when new browser versions are pushed out to developers for testing -- certainly none that cover all popular browsers at once. This service aims to fill that gap." ), p3 );
	appendNode( createText( "\n\n    " ), div );
	
	var p4 = createElement( 'p' );
	setAttribute( p4, 'svelte-1470151360', '' );
	
	appendNode( p4, div );
	appendNode( createText( "Until this is set up for sign-ups, you can contact me at " ), p4 );
	var text13 = createText( root.email );
	appendNode( text13, p4 );
	appendNode( createText( " for more information." ), p4 );

	return {
		mount: function ( target, anchor ) {
			insertNode( div, target, anchor );
		},
		
		update: function ( changed, root ) {
			text13.data = root.email;
		},
		
		teardown: function ( detach ) {
			if ( detach ) {
				detachNode( div );
			}
		}
	};
}

function Main ( options ) {
	options = options || {};
	
	this._state = Object.assign( template.data(), options.data );

	this._observers = {
		pre: Object.create( null ),
		post: Object.create( null )
	};

	this._handlers = Object.create( null );

	this._root = options._root;
	this._yield = options._yield;

	if ( !addedCss ) addCss();
	
	this._fragment = renderMainFragment( this._state, this );
	if ( options.target ) this._fragment.mount( options.target, null );
}

Main.prototype.get = function get( key ) {
 	return key ? this._state[ key ] : this._state;
 };

Main.prototype.fire = function fire( eventName, data ) {
 	var handlers = eventName in this._handlers && this._handlers[ eventName ].slice();
 	if ( !handlers ) return;
 
 	for ( var i = 0; i < handlers.length; i += 1 ) {
 		handlers[i].call( this, data );
 	}
 };

Main.prototype.observe = function observe( key, callback, options ) {
 	var group = ( options && options.defer ) ? this._observers.pre : this._observers.post;
 
 	( group[ key ] || ( group[ key ] = [] ) ).push( callback );
 
 	if ( !options || options.init !== false ) {
 		callback.__calling = true;
 		callback.call( this, this._state[ key ] );
 		callback.__calling = false;
 	}
 
 	return {
 		cancel: function () {
 			var index = group[ key ].indexOf( callback );
 			if ( ~index ) group[ key ].splice( index, 1 );
 		}
 	};
 };

Main.prototype.on = function on( eventName, handler ) {
 	var handlers = this._handlers[ eventName ] || ( this._handlers[ eventName ] = [] );
 	handlers.push( handler );
 
 	return {
 		cancel: function () {
 			var index = handlers.indexOf( handler );
 			if ( ~index ) handlers.splice( index, 1 );
 		}
 	};
 };

Main.prototype.set = function set ( newState ) {
	var oldState = this._state;
	this._state = Object.assign( {}, oldState, newState );
	
	dispatchObservers( this, this._observers.pre, newState, oldState );
	if ( this._fragment ) this._fragment.update( newState, this._state );
	dispatchObservers( this, this._observers.post, newState, oldState );
};

Main.prototype.teardown = function teardown ( detach ) {
	this.fire( 'teardown' );

	this._fragment.teardown( detach !== false );
	this._fragment = null;

	this._state = {};
};

function dispatchObservers( component, group, newState, oldState ) {
	for ( var key in group ) {
		if ( !( key in newState ) ) continue;

		var newValue = newState[ key ];
		var oldValue = oldState[ key ];

		if ( newValue === oldValue && typeof newValue !== 'object' ) continue;

		var callbacks = group[ key ];
		if ( !callbacks ) continue;

		for ( var i = 0; i < callbacks.length; i += 1 ) {
			var callback = callbacks[i];
			if ( callback.__calling ) continue;

			callback.__calling = true;
			callback.call( component, newValue, oldValue );
			callback.__calling = false;
		}
	}
}

function createElement( name ) {
	return document.createElement( name );
}

function setAttribute( node, attribute, value ) {
	node.setAttribute ( attribute, value );
}

function detachNode( node ) {
	node.parentNode.removeChild( node );
}

function insertNode( node, target, anchor ) {
	target.insertBefore( node, anchor );
}

function appendNode( node, target ) {
	target.appendChild( node );
}

function createText( data ) {
	return document.createTextNode( data );
}

return Main;

}());