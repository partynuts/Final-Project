import React from "react";
import { Uploader } from "./uploader.js";
import { Bio } from "./bio.js";
import { Profile } from "./profile.js";
import axios from "../axios";
import { Link } from "react-router-dom";
import Onliners from "./onliners";

export class Userprofile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bioBoxVisible: false,
      commentBoxVisible: false
    };
    this.toggleBio = this.toggleBio.bind(this);
    this.changeBio = this.changeBio.bind(this);
    this.lineBreaks = this.lineBreaks.bind(this);
  }

  componentDidMount() {
    axios
      .get("/userInfo")
      .then(response => {
        if (response.data.success) {
          this.setState(
            {
              userData: response.data.userData
            },
            function() {
              console.log(this.state);
            }
          );
        } else {
          console.log("Error");
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  lineBreaks(e) {
    if (e.keyCode == 13) {
      bioText.textContent = e.target.value;
    }
  }

  toggleBio() {
    this.setState({ bioBoxVisible: !this.state.bioBoxVisible });
  }

  changeBio() {
    axios
      .post("/bio", { bio: this.props.bio })
      .then(resp => {
        if (resp.data.success) {
          this.setState({ bio: resp.data.bio });
          this.setState({ bioBoxVisible: false });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    if (!this.props) {
      return <div className="loader">Loading...</div>;
    }

    let pic = this.props.profilePic;
    if (!pic) {
      pic = "../defaultAvatar2.png";
    } else {
      pic = this.props.profilePic;
    }

    return (
      <div className="userProf">
        <div className="profileBox">
          <img
            id="profPicBig"
            src={pic}
            onClick={this.props.showUploader}
            title="Update profile picture"
          />
        </div>
        <div className="bioBox">
          <div className="bioContent">
            {this.props.first} {this.props.last}
          </div>
          <Bio
            setBio={this.props.setBio}
            bio={this.props.bio}
            toggleBio={this.toggleBio}
            bioBoxVisible={this.state.bioBoxVisible}
            changeBio={this.changeBio}
            lineBreaks={this.lineBreaks}
          />
        </div>
        <div className="wall">
          <div className="wallPosts">Share your thoughts</div>
          <div className="CommentSection" />

          <div className="onlineUserBox">
            <Onliners />
          </div>
        </div>
      </div>
    );
  }
}
