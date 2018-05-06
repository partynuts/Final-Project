import * as io from "socket.io-client";
import { onlineUsers, userLeft, userJoined } from "./action";

let socket;

export function init(store) {
  if (!socket) {
    socket = io.connect();

    socket.on("onlineUsers", data => {
      store.dispatch(onlineUsers(data));
    });

    socket.on("userJoined", data => {
      store.dispatch(userJoined(data));
      console.log("User just joined");
    });

    socket.on("userLeft", data => {
      console.log("User just left");
      store.dispatch(userLeft(data));
    });
  }

  return socket;
}
