import React from "react";
import axios from "../axios";
import { connect } from "react-redux";
import { onlineUsers, userLeft, userJoined } from "./action";
import { Link } from "react-router-dom";

function Onliners(props) {
  // const userUrl = location.pathname.user.id;

  console.log("lalalala");
  console.log("props", props);
  console.log("onliners in comp", props.onliners);
  if (!props.onliners) {
    return null;
  } else {
    let onlineUserList = props.onliners.map(online => {
      let pic = online.profilepic;
      if (!pic) {
        pic = "../defaultAvatar2.png";
      } else {
        pic = online.profilepic;
      }

      return (
        <div key={online.id}>
          <div className="onlineFriends">
            <div className="profPicOnlineBox">
              <Link to="/user/${online.id}">
                <img className="profPicOnline" src={pic} />{" "}
              </Link>
            </div>
            <div className="onlineNames">
              {online.first} {online.last}
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        <span className="onlineUsersHeadline">These friends are online</span>
        <div>{onlineUserList}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  console.log(state);
  return {
    onliners: state.onliners
  };
}

export default connect(mapStateToProps)(Onliners);
