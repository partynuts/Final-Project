import React from "react";
import {Uploader} from "./uploader.js";
import {Bio} from "./bio.js";
import {Userprofile} from "./userprofile.js"

export function Profile(props) {

  let pic = props.profilePic;
  if (!pic) {
    pic = '../defaultAvatar2.png'
  } else {
    pic = props.profilePic;
  }

console.log(props);
  return (
    <div>
      <div>
        <span id="welcome">Welcome {props.first}!</span>
        <img id="profPic" src={pic} onClick={props.showUploader} alt="click to change profile picture" />
      </div>

    </div>
  )

}
