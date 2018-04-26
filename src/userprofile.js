import React from "react";
import {Uploader} from "./uploader.js";
import {Bio} from "./bio.js";
import {Profile} from "./profile.js";
import axios from "../axios";
import {Comment} from "./comment.js";


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
    this.comment = this.comment.bind(this);
    this.toggleComment = this.toggleComment.bind(this);
  }

  lineBreaks(e) {

    if (e.keyCode == 13) {
     bioText.textContent = e.target.value;
     
   }
  }

  toggleBio() {
    this.setState({ bioBoxVisible: !this.state.bioBoxVisible });
  }

  toggleComment() {
    console.log("toggle Comment Box. this.state:", this.state);
    console.log("toggle Comment Box. this.props:", this.props);

    this.setState({ commentBoxVisible: !this.state.commentBoxVisible });
  }

  changeBio() {
    axios.post("/bio", {bio: this.props.bio})
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

  comment() {
    console.log("comment sending fn firing");
    axios.post("/comment", {
        comment: this.props.wallData.comment,
        username: this.props.wallData.username
      })
      .then(resp => {
        if (resp.data.success) {
          console.log("Response Data:", resp);
          this.setState({wallData: resp.data.wallData});
          this.setState({ commentBoxVisible: false });
        }
      })
      .catch(e => {
        console.log(e);
      })
    }


  render() {
    return (
      <div className="userProf">
        <div className="profileBox">
          <img id="profPicBig" src={this.props.profilePic}/>
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
          <div className="wallPosts">
          Share your thoughts
          </div>
          <div className="CommentSection">
            <Comment
              setComment={this.props.setComment}
              lineBreaks={this.lineBreaks}
              comment={this.props.comment}
              wallData={this.state.wallData}
              commentBoxVisible={this.state.commentBoxVisible}
              toggleComment={this.toggleComment}
              />
          </div>
        </div>
      </div>
    );
  }
}
