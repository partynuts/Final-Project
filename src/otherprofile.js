import React from "react";
import axios from "../axios";
import { Bio } from "./bio";
import { Friendship } from "./friendship";

export class OtherProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sameProfile: true
    };
  }

  componentDidMount() {
    console.log("other profile mounted!");
    axios
      .get("/get-user/" + this.props.match.params.userId)
      .then(response => {
        console.log("data self", response.data.self);
        if (response.data.id == response.data.self) {
          this.props.history.push("/");
        } else if (response.data.success) {
          console.log("response data in get otherprofile", response.data);
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
          console.log("Not successful");
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  componentWillReceiveProps(nextProps) {
    console.log("component will receive props", nextProps);
    if (parseInt(nextProps.match.params.userId != this.state.id)) {
      axios
        .get("/get-user/" + nextProps.match.params.userId)
        .then(response => {
          console.log("data self", response.data.self);
          if (response.data.id == response.data.self) {
            this.props.history.push("/");
          } else if (response.data.success) {
            console.log("response data in get otherprofile", response.data);
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
    console.log("props in otheruser", this.state);
    return (
      <div className="userProf">
        <div className="profileBox">
          <img id="profPicBig" src={this.state.profilePic} />
        </div>
        <div>
          {this.state.id && (
            <Friendship {...this.state} />
          )}
        </div>
        <div className="bioBox">
          <div className="bioContent">
            {this.state.first} {this.state.last}
          </div>
          <div className="bioText">{this.state.bio}</div>
        </div>
        <div className="wall">
          <div className="wallPosts">Share your thoughts</div>
        </div>
      </div>
    );
  }
}
