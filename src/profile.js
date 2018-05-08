import React from "react";
import { Uploader } from "./uploader.js";
import { Bio } from "./bio.js";
import { Userprofile } from "./userprofile.js";
import { Welcome } from "./welcome";
import { Link } from "react-router-dom";
import { Menu } from "./menu";
import Chat from "./chat";

export class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false
    };
  }

  render() {
    let pic = this.props.profilePic;
    if (!pic) {
      pic = "../defaultAvatar2.png";
    } else {
      pic = this.props.profilePic;
    }

    console.log(this.props);
    return (
      <div>
        <div className="welcomeDiv" id="welcome">
          Welcome {this.props.first}!
        </div>

        <div className="menuLinksDiv" />
        <div className="icon">
          <i
            className="fa fa-caret-down"
            aria-hidden="true"
            onClick={this.props.toggleMenu}
          />
        </div>
        <div className="picDiv">
          <a href="/welcome">
            {" "}
            <img id="profPic" src={pic} />
          </a>
        </div>
      </div>
    );
  }
}
