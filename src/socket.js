import * as io from "socket.io-client";

// import { onlineUser, userJoined, userLeft } from "./actions";

let socket;

export function init(store) {
  if (!socket) {
    socket = io.connect();

    socket.on("onlineUsers", data => {
      store.dispatch(onlineUsers(data));
    });

    socket.on("userJoined", data => {
      store.dispatch(userJoined(data));
    });

    socket.on("userLeft", data => {
      store.dispatch(userLeft(data));
    });
  }

  return socket;
}
