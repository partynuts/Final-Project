export default function reducer(state={}, action) {
if (action.type == 'GET_FRIENDS_AND_REQUESTS') {
  state = Object.assign({}, state, {friends: action.friends});
}
if (action.type == 'GET_OTHERS') {
  console.log("OTHER ACTIONS",action.others);
  const {others} = action
state = Object.assign({}, state, {otherPeople: others});

}
if (action.type == 'ACCEPT_FRIENDS') {
  console.log("action", action);
  state = Object.assign({}, state, {
    friends: state.friends.map(item => {
      if (item.id == action.id) {
        return Object.assign({}, item, {status: 2})
      } else {
        return Object.assign({}, item)
      }
    })
  })
}
if (action.type == 'END_FRIENDSHIP') {
  console.log("action", action);
  state = Object.assign({}, state, {
    friends: state.friends.map(items => {
      if (items.id == action.id) {
        return Object.assign({}, items, {status: null})
      } else {
        return Object.assign({}, items)
      }
    })
  })
}

  console.log("state after update", state);
  return state;
}
