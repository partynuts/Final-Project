import React from "react";
import axios from "../axios";

export class Friendship extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      btnText: "send friend request"
    };

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
        if (response.data.success && response.data.status == null) {
          console.log("FR check first if", response.data);
        } else {
          if (
            response.data.success &&
            response.data.status == 1 &&
            response.data.receivedRequest
          ) {
            console.log("FR check if", response.data);
            this.setState({
              btnText: "Accept friend request",
              friendshipStatus: response.data.status,
              receivedRequest: true
            });
          } else {
            console.log("FR check else", response.data);
            this.setState({
              btnText: "Cancel friend request",
              friendshipStatus: response.data.status,
              receivedRequest: false
            });
          }
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
            btnText: "Cancel friend request",
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
            btnText: "Send friend request",
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
      .post("/acceptFriendship", {
        otherUserId: this.props.id
      })
      .then(resp => {
        if (resp.data.success) {
          console.log("resp.data", resp);
          this.setState({
            btnText: "End friendship",
            status: resp.data.status,
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
            <button
              name="friendship"
              type="submit"
              onClick={this.makeFriendRequest}
            >
              {this.state.btnText}
            </button>
          )}
        </div>
        <div>
          {(this.state.friendshipStatus == 1 &&
            this.state.receivedRequest) && (
              <button onClick={this.acceptFriendRequest}>
                {this.state.btnText}
              </button>
            )}
        </div>
        <div>
          {(this.state.friendshipStatus == 1 &&
            !this.state.receivedRequest) && (
              <button onClick={this.cancelFriendRequest}>
                {this.state.btnText}
              </button>
            )}
        </div>
      </div>
    );
  }
}
