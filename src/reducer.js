export default function reducer( state = {}, action ) {
	if ( action.type == "GET_FRIENDS_AND_REQUESTS" ) {
		state = Object.assign( {}, state, {
			friends: action.friends
		}, {
			selfUserId: action.selfUserId
		} );
	}
	if ( action.type == "GET_OTHERS" ) {
		state = Object.assign( {}, state, {
			noFriendshipStatus: action.others
		} );
	}
	if ( action.type == "MAKE_FRIENDS" ) {
		const newFriends = state.noFriendshipStatus.filter( user => {
			return user.id == action.id
		} )
		let newFriend = newFriends[ 0 ]
		newFriend.status = 1;
		return Object.assign( {}, state, {
			friends: [ ...state.friends, newFriend ],
			noFriendshipStatus: state.noFriendshipStatus.filter( user => {
				return user.id != action.id
			} )
		} )
	}

	if ( action.type == "ACCEPT_FRIENDS" ) {
		state = Object.assign( {}, state, {
			friends: state.friends.map( item => {
				if ( item.id == action.id ) {
					return Object.assign( {}, item, {
						status: 2
					} );
				} else {
					return Object.assign( {}, item );
				}
			} )
		} );
	}
	if ( action.type == "END_FRIENDSHIP" ) {
		const noFriends = state.friends.filter( item => {
			return item.id == action.id
		} )
		let noFriend = noFriends[ 0 ];
		state = Object.assign( {}, state, {
			noFriendshipStatus: [ noFriend, ...state.noFriendshipStatus ],
			friends: state.friends.filter( items => {
				return items.id != action.id
			} )
		} )


	}
	if ( action.type == "GET_ONLINE_USERS" ) {
		state = Object.assign( {}, state, {
			onliners: action.onliners
		} );
	}
	if ( action.type == "LEFT_USER" ) {
		const onliners = state.onliners.filter( user => action.userId != user.id );
		return ( state = Object.assign( {}, state, {
			onliners: onliners
		} ) );
	}
	if ( action.type == "JOINED_USER" ) {
		let newUser = action.newUser;
		return {
			...state,
			onliners: state.onliners.concat( newUser )
		};
	}
	if ( action.type == "SEND_COMMENT" ) {
		let {
			allComments
		} = state;
		let {
			commentText
		} = action;
		commentText.key = new Date();

		return {
			...state,
			allComments: state.allComments
				.reverse()
				.concat( commentText )
				.reverse()
		};
	}
	if ( action.type == "GET_ALL_COMMENTS" ) {

		return {
			...state,
			allComments: action.allComments
		};
	}
	if ( action.type == "GET_MESSAGES" ) {
		return {
			...state,
			chatMsgs: action.chatMsgs
		};
	}

	return state;
}