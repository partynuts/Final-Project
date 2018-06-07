import * as io from "socket.io-client";
import {
	onlineUsers,
	userLeft,
	userJoined,
	chatMessage
} from "./action";

let socket;

export function init( store ) {
	if ( !socket ) {
		socket = io.connect();

		socket.on( "onlineUsers", data => {
			store.dispatch( onlineUsers( data ) );
		} );

		socket.on( "userJoined", data => {
			store.dispatch( userJoined( data ) );
		} );

		socket.on( "userLeft", data => {
			store.dispatch( userLeft( data ) );
		} );

		socket.on( "chatMessages", data => {
			store.dispatch( chatMessage( data ) );
		} );
	}

	return socket;
}

export function emit( eventName, data ) {
	socket.emit( eventName, data );
}