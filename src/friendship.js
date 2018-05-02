import React from "react";
import axios from "../axios";

export class Friendship extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.makeFriendRequest = this.makeFriendRequest.bind(this);
    this.cancelFriendRequest = this.cancelFriendRequest.bind(this);
    this.acceptFriendRequest = this.acceptFriendRequest.bind(this);
  }

  componentDidMount() {
    console.log("in friendship Component setting status");
    console.log("props", this);
    axios
      .get("/friendship/" + this.props.id)
      .then(response => {
        console.log("response fr", response);
      if (response.data.success) {
        if (response.data.receivedRequest) {
          this.setState({
            friendshipStatus: response.data.status,
            receivedRequest: true,
          });
        } else {
          this.setState({
            friendshipStatus: response.data.status,
            receivedRequest: false,
          })
        }

      } else {
        this.setState({
          friendshipStatus: null
        });
      }
      })
      .catch(e => {
        console.log(e);
      });
  }

  makeFriendRequest() {
    axios
      .post("/makeFriendship/" + this.props.id)
      .then(response => {
        if (response.data.success) {
          this.setState({
            friendshipStatus: 1
          });
        } else {
          console.log("Something is wrong");
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  cancelFriendRequest() {
    axios
      .post("/cancelFriendship/" + this.props.id)
      .then(response => {
        if (response.data.success) {
          this.setState({
            friendshipStatus: null
          });
        } else {
          console.log("Not working");
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  async acceptFriendRequest() {
    const response = await axios
      .post("/acceptFriendship/" + this.props.id)
      .then(resp => {
        if (resp.data.success) {
          console.log("resp.data", resp);
          this.setState({
            friendshipStatus: 2
          });
        }
      });
  }

  render() {
    console.log("props in otheruser", this.state);
    return (
      <div>
        <div>
          {!this.state.friendshipStatus && (
            <button className="friendshipBtn"
              name="friendship"
              type="submit"
              onClick={this.makeFriendRequest}
            >
            Send friend request
            </button>
          )}
        </div>
        <div>
          {(this.state.friendshipStatus == 1 &&
            this.state.receivedRequest) && (
              <button className="friendshipBtn" name="friendship"
              type="submit" onClick={this.acceptFriendRequest}>
                Accept Friend Request
              </button>
            )}
        </div>
        <div>
          {(this.state.friendshipStatus == 1 &&
            !this.state.receivedRequest) && (
              <button className="friendshipBtn" name="friendship"
              type="submit" onClick={this.cancelFriendRequest}>
              Cancel friend request
              </button>
            )}
        </div>
        <div>
          {this.state.friendshipStatus == 2 && (
              <button className="friendshipBtn" name="friendship"
              type="submit" onClick={this.cancelFriendRequest}>
                End friendship
              </button>
            )}
        </div>
      </div>
    );
  }
}
