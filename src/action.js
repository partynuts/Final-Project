import React from "react";
import axios from "../axios";
import { init } from "./socket";

function getFriendsAndRequests() {
  return axios.get("/friends").then(function(response) {
    return {
      type: "GET_FRIENDS_AND_REQUESTS",
      friends: response.data.friends,
      selfUserId: response.data.selfUserId
    };
  });
}

exports.getFriendsAndRequests = getFriendsAndRequests;

function makeFriendRequest(id) {
  return axios.post("/makeFriendship/" + id).then(function(response) {
    return {
      type: "MAKE_FRIENDS",
      id
    }
  })
}

exports.makeFriendRequest = makeFriendRequest;

function acceptFriendRequest(id) {
  return axios.post("/acceptFriendship/" + id).then(function(response) {
    return {
      type: "ACCEPT_FRIENDS",
      id
    };
  });
}

exports.acceptFriendRequest = acceptFriendRequest;

function endFriendship(id) {
  return axios.post("/cancelFriendship/" + id).then(function(response) {
    return {
      type: "END_FRIENDSHIP",
      id
    };
  });
}

exports.endFriendship = endFriendship;

function getOtherUsers() {
  return axios.get("/otherUsers").then(function(response) {
    return {
      type: "GET_OTHERS",
      others: response.data.others
    };
  });
}

exports.getOtherUsers = getOtherUsers;

function onlineUsers(data) {
  return {
    type: "GET_ONLINE_USERS",
    onliners: data.online
  };
}

exports.onlineUsers = onlineUsers;

function userJoined(data) {
  return {
    type: "JOINED_USER",
    newUser: data.newUser
  };
}

exports.userJoined = userJoined;

function userLeft(data) {
  return {
    type: "LEFT_USER",
    userId: data.userId
  };
}

exports.userLeft = userLeft;

function getAllComments(receivingUserId) {
  return axios.get("/comment/" + receivingUserId).then(response => {
    if (response.data.success) {
      return {
        type: "GET_ALL_COMMENTS",
        allComments: response.data.wallData
      };
    }
  });
}

exports.getAllComments = getAllComments;

function sendComment(commentText, userId) {
  return axios
    .post("/comment", {
      commentText: commentText,
      userId: userId
    })
    .then(resp => {
      
      return {
        type: "SEND_COMMENT",
        commentText: resp.data.wallData
      };
    });
}

exports.sendComment = sendComment;

export function chatMessage(data) {
  return {
    type: "GET_MESSAGES",
    chatMsgs: data
  };
}
