import React from "react";
import axios from "../axios";
import { init } from "./socket";

function getFriendsAndRequests() {
  return axios.get("/friends").then(function(response) {
    console.log("response friendslist", response);
    return {
      type: "GET_FRIENDS_AND_REQUESTS",
      friends: response.data.friends
    };
  });
}

exports.getFriendsAndRequests = getFriendsAndRequests;

function acceptFriendRequest(id) {
  console.log("id", id);
  return axios.post("/acceptFriendship/" + id).then(function(response) {
    return {
      type: "ACCEPT_FRIENDS",
      id
    };
  });
}

exports.acceptFriendRequest = acceptFriendRequest;

function endFriendship(id) {
  console.log("id", id);
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
  console.log("these peeps are on");
  return {
    type: "GET_ONLINE_USERS",
    onliners: data.online
  };
}

exports.onlineUsers = onlineUsers;

function userJoined(data) {
  console.log("these peeps just joined");
  return {
    type: "JOINED_USER",
    newUser: data.newUser
  };
}

exports.userJoined = userJoined;

function userLeft(data) {
  console.log("these peeps are off", data);
  return {
    type: "LEFT_USER",
    userId: data.userId
  };
}

exports.userLeft = userLeft;

function getAllComments(receivingUserId) {
  return axios.get("/comment/" + receivingUserId).then(response => {
    console.log("get all comments", response.data);
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
  console.log("comment sending fn firing");
  console.log("this commentTetx", commentText, userId);
  axios
    .post("/comment", {
      commentText: commentText,
      userId: userId
    })
    .then(resp => {
      console.log("resp SendComment", resp);
      return {
        type: "GET_ALL_COMMENTS",
        commentText: resp.data.wallData,
        userId
      };
      return {
        type: "SEND_COMMENT",
        commentText: resp.data.commentText,
        userId
      };
    });
}

exports.sendComment = sendComment;

function mostRecentTenMessages(data) {}

// function setComment(e) {
//   return {
//     type: "SET_INPUT",
//     comment: e.target.value
//   };
// }
//
// exports.setComment = setComment;
