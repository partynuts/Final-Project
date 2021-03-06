const express = require( "express" );
const app = express();
const compression = require( "compression" );
const bodyParser = require( "body-parser" );
const {
	hashPassword,
	checkPassword
} = require( "./bcrypt" );
const server = require( "http" ).Server( app );
const io = require( "socket.io" )( server, {
	origins: "*:*"
} );

const {
	setRegistration,
	setLogin,
	insertImageData,
	insertBio,
	insertComments,
	displayComments,
	getProfileInfo,
	makeFriendRequest,
	changeFriendshipStatus,
	checkFriendship,
	cancelFriendshipRequest,
	acceptFriendship,
	pullFriendsList,
	pullOtherUsers,
	getUsersByIds
} = require( "./db.js" );
const cookieSession = require( "cookie-session" );
const cookieParser = require( "cookie-parser" );
const csurf = require( "csurf" );
const multer = require( "multer" );
const uidSafe = require( "uid-safe" );
const path = require( "path" );
const s3 = require( "./s3" );

const config = require( "./config.json" );

const diskStorage = multer.diskStorage( {
	destination: function( req, file, callback ) {
		callback( null, __dirname + "/uploads" );
	},
	filename: function( req, file, callback ) {
		uidSafe( 24 ).then( function( uid ) {
			callback( null, uid + path.extname( file.originalname ) ); //extname will give the extension name of the uploaded file, i.e. png, img...
		} );
	}
} );
var uploader = multer( {
	storage: diskStorage,
	limits: {
		fileSize: 2097152 //limiting the files to 2 megabytes
	}
} );

app.use( compression() );
app.use( express.static( "./public" ) );

const cookieSessionMiddleware = cookieSession( {
	secret: `Man's not hot`,
	maxAge: 1000 * 60 * 60 * 24 * 14 //expiration of the session (like on banking pages)
} );

app.use( cookieSessionMiddleware );

io.use( function( socket, next ) {
	cookieSessionMiddleware( socket.request, socket.request.res, next );
} );

app.use( bodyParser.json() );

app.use( csurf() );

app.use( function( req, res, next ) {
	res.cookie( "mytoken", req.csrfToken() );
	next();
} );

if ( process.env.NODE_ENV != "production" ) {
	app.use(
		"/bundle.js",
		require( "http-proxy-middleware" )( {
			target: "http://localhost:8081/"
		} )
	);
} else {
	app.use( "/bundle.js", ( req, res ) => res.sendFile( `${__dirname}/bundle.js` ) );
}

function requireLogin( req, res, next ) {
	if ( !req.session.user ) {
		res.sendStatus( 403 );
	} else {
		next();
	}
}

app.get( "/user", requireLogin, ( req, res ) => {
	db.getProfileInfo( req.session.user );
} );

let onlineUsers = [];
let latestMsgs = [];

io.on( "connection", function( socket ) {
	const session = socket.request.session;

	onlineUsers.push( {
		socketId: socket.id,
		userId: session.user.id
	} );

	const ids = onlineUsers.map( user => user.userId );
	getUsersByIds( ids ).then( result => {
		socket.emit( "onlineUsers", {
			online: result.rows
		} );
	} );

	io.sockets.emit( "chatMessages", latestMsgs );

	socket.on( "chatMessage", data => {
		getProfileInfo( session.user.id ).then( response => {
			let msgInfo = {
				chatMsg: data,
				first: session.user.first,
				last: session.user.last,
				profPic: response.rows[ 0 ].profilepic,
				time: new Date()
			};
			latestMsgs.push( msgInfo );
			if ( latestMsgs.length > 10 ) {
				latestMsgs.shift();
				io.sockets.emit( "chatMessages", latestMsgs );
			} else {
				io.sockets.emit( "chatMessages", latestMsgs );
			}
		} );
	} );

	getProfileInfo( session.user.id ).then( response => {
		socket.broadcast.emit( "userJoined", {
			newUser: response.rows[ 0 ]
		} );
	} );



	socket.on( "disconnect", function() {
		onlineUsers = onlineUsers.filter( user => user.socketId != socket.id );
		if ( !onlineUsers.find( user => user.userId == session.user.id ) ) {
			io.sockets.emit( "userLeft", {
				userId: session.user.id
			} );
		}
	} );
} );

app.get( "/userInfo", function( req, res ) {
	setLogin( req.session.user.email )
		.then( function( result ) {
			res.json( {
				success: true,
				userData: result.rows[ 0 ]
			} );
		} )
		.catch( e => {
			console.log( e );
		} );
} );

app.get( "/welcome", function( req, res ) {
	if ( req.session.user ) {
		res.redirect( "/" );
	} else {
		res.sendFile( __dirname + "/index.html" );
	}
} );

app.get( "/get-user/:userId", function( req, res ) {
	if ( req.params.userId == req.session.user.id ) {
		return res.json( {
			sameProfile: true
		} );
	}
	getProfileInfo( req.params.userId )
		.then( results => {
			res.json( {
				success: true,
				first: results.rows[ 0 ].first,
				last: results.rows[ 0 ].last,
				profilePic: results.rows[ 0 ].profilepic,
				bio: results.rows[ 0 ].bio,
				id: results.rows[ 0 ].id,
				self: req.session.user.id,
				sameProfile: false
			} );
		} )
		.catch( e => {
			console.log( e );
		} );
} );

app.post( "/register", function( req, res ) {
	let first = req.body.first;
	let last = req.body.last;
	let email = req.body.email;
	let pw = req.body.pw;
	if ( first && last && email && pw ) {
		hashPassword( pw ).then( function( results ) {
			setRegistration( first, last, email, results )
				.then( function( result ) {
					req.session.user = {
						id: result.rows[ 0 ].id,
						first: req.body.first,
						last: req.body.last,
						email: req.body.email
					};
					res.json( {
						success: true,
						loggedIn: req.session.user.id
					} );
				} )
				.catch( e => {
					console.log( e );
				} );
		} );
	} else {
		res.json( {
			success: false
		} );
	}
} );

app.post( "/login", function( req, res ) {
	let email = req.body.email;
	let pw = req.body.pw;
	if ( email && pw ) {
		setLogin( email ).then( function( result ) {
			let user = result.rows[ 0 ];
			if ( !user ) {
				res.json( {
					success: false
				} );
			}
			checkPassword( pw, result.rows[ 0 ].pw )
				.then( function( doesMatch ) {
					if ( doesMatch ) {
						req.session.user = {
							id: result.rows[ 0 ].id,
							first: result.rows[ 0 ].first,
							last: result.rows[ 0 ].last,
							email: req.body.email
						};
						res.json( {
							success: true,
							loggedIn: req.session.user.id
						} );
					} else {
						res.json( {
							success: false
						} );
					}
				} )
				.catch( e => {
					console.log( e );
				} );
		} );
	} else {
		res.json( {
			success: false
		} );
	}
} );

app.post( "/uploader", uploader.single( "file" ), s3.upload, function( req, res ) {
	if ( req.file ) {
		const imageUrl = config.s3Url + req.file.filename;
		insertImageData( imageUrl, req.session.user.id )
			.then( function( result ) {
				res.json( {
					success: true,
					userData: result.rows[ 0 ]
				} );
			} )
			.catch( e => {
				console.log( e );
			} );
	} else {
		console.log( "boo!" );
		res.json( {
			success: false
		} );
	}
} );

app.post( "/bio", function( req, res ) {
	if ( req.body.bio ) {
		insertBio( req.body.bio, req.session.user.id )
			.then( function( result ) {
				res.json( {
					success: true,
					bio: result.rows[ 0 ].bio
				} );
			} )
			.catch( e => {
				console.log( e );
			} );
	} else {
		res.json( {
			success: false
		} );
	}
} );

app.post( "/comment", function( req, res ) {
	if ( req.body ) {
		insertComments( req.body.commentText, req.session.user.id, req.body.userId )
			.then( function( result ) {
				console.log( result );
				displayComments( req.body.userId ).then( function( results ) {
					let last = results.rowCount - 1;
					console.log( "in get comments route", results.rows[ 0 ] );
					results.rows.forEach( item => {
						let date = new Date( item.timesent );
						item.timesent = date.toLocaleString();
					} );
					console.log( "results in gettin g comments", result.rows );
					res.json( {
						success: true,
						wallData: results.rows[ 0 ]
					} );

					// username: result.rows[0].username
					// comment: result.rows[0].comment,
				} );
			} )
			.catch( e => {
				console.log( e );
			} );
	} else {
		res.json( {
			success: false
		} );
	}
} );

app.get( "/comment/:receivingUserId", function( req, res ) {
	displayComments( req.params.receivingUserId ).then( function( results ) {
		results.rows.forEach( item => {
			let date = new Date( item.timesent );
			item.timesent = date.toLocaleString();
		} );
		res.json( {
			success: true,
			wallData: results.rows
		} );
	} );
} );

app.get( "/friendship/:userId", function( req, res ) {
	checkFriendship( req.session.user.id, req.params.userId )
		.then( function( result ) {
			if ( result.rows.length == 0 ) {
				res.json( {
					success: true,
					status: 0
				} );
			} else {
				res.json( {
					success: true,
					status: result.rows[ 0 ].status,
					receiver_id: result.rows[ 0 ].receiver_id,
					sender_id: result.rows[ 0 ].sender_id,
					friendshipId: result.rows[ 0 ].id,
					timestamp: result.rows[ 0 ].created_at,
					receivedRequest: req.session.user.id == result.rows[ 0 ].receiver_id
				} );
			}
		} )
		.catch( e => {
			console.log( e );
		} );
} );

app.post( "/makeFriendship/:userId", function( req, res ) {
	makeFriendRequest( req.session.user.id, req.params.userId )
		.then( function( result ) {
			res.json( {
				success: true,
				status: result.rows[ 0 ].status,
				receiver_id: result.rows[ 0 ].receiver_id,
				sender_id: result.rows[ 0 ].sender_id,
				friendshipId: result.rows[ 0 ].id,
				timestamp: result.rows[ 0 ].created_at
			} );
		} )
		.catch( e => {
			console.log( e );
		} );
} );

app.post( "/cancelFriendship/:userId", function( req, res ) {

	cancelFriendshipRequest( req.session.user.id, req.params.userId )
		.then( function( result ) {
			res.json( {
				success: true
			} );
		} )
		.catch( e => {
			console.log( e );
		} );
} );

app.post( "/acceptFriendship/:userId", function( req, res ) {
	acceptFriendship( req.session.user.id, req.params.userId )
		.then( function( results ) {
			// console.log("rresult in aFR accepting", results);
			res.json( {
				success: true,
				status: results.rows[ 0 ].status
			} );
		} )
		.catch( e => {
			console.log( e );
		} );
} );

app.get( "/friends", function( req, res ) {

	pullFriendsList( req.session.user.id ).then( function( results ) {
		res.json( {
			friends: results.rows,
			selfUserId: req.session.user.id
		} );
	} );
} );

app.get( "/otherUsers", function( req, res ) {
	pullOtherUsers( req.session.user.id ).then( response => {
		return res.json( {
			success: true,
			others: response.rows
		} );
	} );
} );

app.get( "/logout", ( req, res ) => {
	req.session.user = null;
	res.redirect( "/welcome" );
} );

app.get( "*", function( req, res ) {
	if ( !req.session.user ) {
		res.redirect( "/welcome" );
	} else {
		res.sendFile( __dirname + "/index.html" );
	}
} );

server.listen( process.env.PORT || 8080 );