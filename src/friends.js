import React from "react";
import axios from "../axios";
import { connect } from 'react-redux';
import {getFriendsAndRequests, acceptFriendRequest, endFriendship, getOtherUsers} from "./action";


class Friends extends React.Component {


  componentDidMount() {
    console.log("comp did mount in friends");
    console.log("NIX DA",this.props);
    this.props.dispatch(getFriendsAndRequests());
    this.props.dispatch(getOtherUsers())

  }

  render() {
    if (!this.props.pendingRequests) {
      return (
        <div className="loader">Loading...</div>
      );
    }

    let pendingReqList = this.props.pendingRequests.map(pendingRequest => {

    return (
           <div key={pendingRequest.id} className="pendingReq">
           <img className="profPicFriends" src={pendingRequest.profilepic}/> {pendingRequest.profilepic} {pendingRequest.first} {pendingRequest.last}

           <button className="friendsBtn" onClick={() => this.props.dispatch(acceptFriendRequest(pendingRequest.id))}>Accept friend request</button>
           </div>
       )


   })
let acceptedList = this.props.acceptedFriends.map(acceptedFriend => {
  return (
         <div key={acceptedFriend.id} className="acceptedFriends">
         <img className="profPicFriends" src={acceptedFriend.profilepic}/>  {acceptedFriend.first} {acceptedFriend.last}
         <button className="friendsBtn" onClick={() => this.props.dispatch(endFriendship(acceptedFriend.id))}>End friendship</button>
         </div>
     )
})






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
        <div>
          <h1>HALLO HIER SIND WIR!</h1>
      


        </div>
      </div>
    )
  }
}


const mapStateToProps = function(state) {
  console.log("stateSTATESTAETS", state);
    return {

      pendingRequests: state.friends && state.friends.filter(friends => friends.status == 1),
      acceptedFriends: state.friends && state.friends.filter(friends => friends.status == 2),
      noFriendshipStatus: state.otherPeople && state.otherPeople


    };
};


export default connect(mapStateToProps)(Friends);
