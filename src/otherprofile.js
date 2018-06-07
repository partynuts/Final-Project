import React from "react";
import axios from "../axios";
import { Bio } from "./bio";
import { Friendship } from "./friendship";
import Comment from "./comment";

export class OtherProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sameProfile: true
    };
  }

  componentDidMount() {
    axios
      .get("/get-user/" + this.props.match.params.userId)
      .then(response => {
        if (
          response.data.success == false &&
          response.data.id == response.data.self
        ) {
          this.props.history.push("/");
        } else if (response.data.success) {
          this.setState(
            {
              first: response.data.first,
              last: response.data.last,
              profilePic: response.data.profilePic,
              bio: response.data.bio,
              id: response.data.id,
              sameProfile: response.data.sameProfile
            },
            function() {
              console.log("this.state", this.state);
            }
          );
        } else {
          console.log("Get user was not successful");
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (parseInt(nextProps.match.params.userId != this.state.id)) {
      axios
        .get("/get-user/" + nextProps.match.params.userId)
        .then(response => {
          if (response.data.id == response.data.self) {
            this.props.history.push("/");
          } else if (response.data.success) {
            this.setState({
              first: response.data.first,
              last: response.data.last,
              profilePic: response.data.profilePic,
              bio: response.data.bio,
              id: response.data.id,
              sameProfile: response.data.sameProfile
            });
          } else {
            console.log("Not successful");
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  render() {
    let pic = this.state.profilePic;
    if (!pic) {
      pic = "../defaultAvatar2.png";
    } else {
      pic = this.state.profilePic;

    }
    return (
      <div className="userProf">
        <div className="profileBox">
          <img id="profPicBig" src={pic} />
        </div>
        <div>{this.state.id && <Friendship {...this.state} />}</div>
        <div className="bioBox">
          <div className="bioContent">
            {this.state.first} {this.state.last}
          </div>
          <div className="bioText">{this.state.bio}</div>
        </div>
        <div className="wall">
          <div className="wallPosts">Share your thoughts</div>
          {this.state.id && <Comment receivingUserId={this.state.id} />}
        </div>
      </div>
    );
  }
}
