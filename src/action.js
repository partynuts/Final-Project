import React from "react";
import axios from "../axios";


function getFriendsAndRequests() {

  return axios.get("/friends").then(function(response) {
    console.log("response friendslist", response);
    return {
        type: 'GET_FRIENDS_AND_REQUESTS',
        friends: response.data.friends
    };
  })


}

exports.getFriendsAndRequests = getFriendsAndRequests;


function acceptFriendRequest(id) {
  console.log("id", id);
  return axios.post("/acceptFriendship/" + id).then(function(response) {
    return {
      type: 'ACCEPT_FRIENDS',
      id
    }
  })
}

exports.acceptFriendRequest = acceptFriendRequest;


function endFriendship(id) {
  console.log("id", id);
  return axios.post("/cancelFriendship/" + id).then(function(response) {
    return {
      type: 'END_FRIENDSHIP',
      id
    }
  })
}

exports.endFriendship = endFriendship;


function getOtherUsers() {
   return axios.get("/otherUsers").then(function(response) {
    return {
        type: 'GET_OTHERS',
        others: response.data.others
    };
  })

}

exports.getOtherUsers = getOtherUsers;
