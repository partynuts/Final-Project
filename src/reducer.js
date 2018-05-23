export default function reducer(state = {}, action) {
  if (action.type == "GET_FRIENDS_AND_REQUESTS") {
    console.log("FR and Friends", action.friends);
    state = Object.assign({}, state, { friends: action.friends }, {selfUserId: action.selfUserId});
  }
  if (action.type == "GET_OTHERS") {
    console.log("OTHER ACTIONS", action.others);
    // const { others } = action;
    state = Object.assign({}, state, { noFriendshipStatus: action.others });
  }
if (action.type == "MAKE_FRIENDS") {
const newFriends = state.noFriendshipStatus.filter(user => {
  return user.id == action.id
})
let newFriend = newFriends[0]
newFriend.status = 1;
return Object.assign({}, state, {
  friends: [...state.friends, newFriend],
  noFriendshipStatus: state.noFriendshipStatus.filter(user => {
    return user.id != action.id
  })
})
}

  if (action.type == "ACCEPT_FRIENDS") {
    console.log("action", action);
    state = Object.assign({}, state, {
      friends: state.friends.map(item => {
        if (item.id == action.id) {
          return Object.assign({}, item, { status: 2 });
        } else {
          return Object.assign({}, item);
        }
      })
    });
  }
  if (action.type == "END_FRIENDSHIP") {
    console.log("action", action);
    const noFriends = state.friends.filter(item => {
      return item.id == action.id
    })
let noFriend = noFriends[0];
state = Object.assign({}, state, {
  noFriendshipStatus: [ noFriend, ...state.noFriendshipStatus],
  friends: state.friends.filter(items => {
    return items.id != action.id
  })
})


  }
  if (action.type == "GET_ONLINE_USERS") {
    console.log("getting online users");
    console.log(action.onliners);
    state = Object.assign({}, state, {
      onliners: action.onliners
    });
    console.log("onliners in reducer", state.onliners);
    console.log("Object assign onliners", state);
    // return Object.assign({}, state);
  }
  if (action.type == "LEFT_USER") {
    console.log("state onliners before leaving", state.onliners);
    const onliners = state.onliners.filter(user => action.userId != user.id);
    console.log("new onliners", onliners);
    console.log("action userId", action.userId);
    return (state = Object.assign({}, state, {
      onliners: onliners
    }));
  }
  if (action.type == "JOINED_USER") {
    let newUser = action.newUser;
    return {
      ...state,
      onliners: state.onliners.concat(newUser)
    };
  }
  if (action.type == "SEND_COMMENT") {
    console.log("Send in reducer", action.commentText);
    console.log("state in sending com", state);
    let { allComments } = state;
    let { commentText } = action;
    commentText.key = new Date();

    return {
      ...state,
      allComments: state.allComments
        .reverse()
        .concat(commentText)
        .reverse()
    };
  }
  if (action.type == "GET_ALL_COMMENTS") {
    console.log("getting comments from db", action.allComments);

    return {
      ...state,
      allComments: action.allComments
    };
  }
  if (action.type == "GET_MESSAGES") {
    console.log("action msgs", action.chatMsgs);
    return {
      ...state,
      chatMsgs: action.chatMsgs
    };
  }

  console.log("state after update", state);
  return state;
}
