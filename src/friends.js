import React from "react";
import axios from "../axios";
import { connect } from "react-redux";
import {
  getFriendsAndRequests,
  acceptFriendRequest,
  endFriendship,
  getOtherUsers
} from "./action";
import { Link } from "react-router-dom";

class Friends extends React.Component {
  componentDidMount() {
    console.log("comp did mount in friends");
    console.log("NIX DA", this.props);
    this.props.dispatch(getFriendsAndRequests());
    this.props.dispatch(getOtherUsers());
  }

  render() {
    if (!this.props.pendingRequests) {
      return <div className="loader">Loading...</div>;
    }

    let pendingReqList = this.props.pendingRequests.map(pendingRequest => {
      let pic = pendingRequest.profilepic;
      if (!pic) {
        pic = "../defaultAvatar2.png";
      } else {
        pic = pendingRequest.profilepic;
      }
      return (
        <div key={pendingRequest.id} className="pendingReq">
          <Link to={`/user/${pendingRequest.id}`}>
            <img className="profPicFriends" src={pic} />{" "}
          </Link>
          {pendingRequest.first} {pendingRequest.last}
          <button
            className="friendsBtn"
            onClick={() =>
              this.props.dispatch(acceptFriendRequest(pendingRequest.id))
            }
          >
            Accept friend request
          </button>
        </div>
      );
    });
    let acceptedList = this.props.acceptedFriends.map(acceptedFriend => {
      let pic = acceptedFriend.profilepic;
      if (!pic) {
        pic = "../defaultAvatar2.png";
      } else {
        pic = acceptedFriend.profilepic;
      }
      return (
        <div key={acceptedFriend.id} className="acceptedFriends">
          <Link to={`/user/${acceptedFriend.id}`}>
            <img className="profPicFriends" src={pic} />{" "}
          </Link>
          {acceptedFriend.first} {acceptedFriend.last}
          <button
            className="friendsBtn"
            onClick={() =>
              this.props.dispatch(endFriendship(acceptedFriend.id))
            }
          >
            End friendship
          </button>
        </div>
      );
    });

    return (
      <div className="friendsWrapper">
        <div className="acceptedFriendsContainer">
          <h2> Your friends with plants!</h2>
          {acceptedList}
        </div>
        <div className="pendingReqContainer">
          <h2> Your friend requests!</h2>
          {pendingReqList}
        </div>
        <div />
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    pendingRequests:
      state.friends && state.friends.filter(friends => friends.status == 1),
    acceptedFriends:
      state.friends && state.friends.filter(friends => friends.status == 2),
    noFriendshipStatus: state.otherPeople && state.otherPeople
  };
};

export default connect(mapStateToProps)(Friends);
