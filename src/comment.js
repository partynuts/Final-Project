import React from "react";
import axios from "../axios";

export class Comment extends React.Component {
  constructor(props) {
    console.log("In comment class showing props", props);
    super(props);
    this.state = { commentBoxVisible: false };
    // this.setComment = this.setComment.bind(this);
    // this.setUsername = this.setUsername.bind(this);
    // this.toggleComment = this.toggleComment.bind(this);
  }

  componentDidMount() {
    console.log("mounted in comments");
    console.log("rec userId", this.props.receivingUserId);
  }

  // toggleComment() {
  //   console.log("Comment Box opening");
  //   this.setState({ commentBoxVisible: !this.state.commentBoxVisible });
  // }
  //
  // setComment(e) {
  //   this.setState(
  //     {
  //       wallData: {
  //         ...this.state.wallData,
  //         comment: e.target.value
  //       }
  //     },
  //     function() {
  //       console.log("this.state in set Comment:", this.state.wallData);
  //     }
  //   );
  // }
  // setUsername(e) {
  //   this.setState({
  //     wallData: {
  //       ...this.state.wallData,
  //       username: e.target.value
  //     }
  //   });
  // }

  // sendComment() {
  //   console.log("comment sending fn firing");
  //   axios
  //     .post("/comment", {
  //       comment: this.props.wallData.comment
  //       // username: this.props.wallData.username
  //     })
  //     .then(resp => {
  //       if (resp.data.success) {
  //         console.log("Response Data:", resp);
  //         this.setState({ wallData: resp.data.wallData });
  //         this.setState({ commentBoxVisible: false });
  //       }
  //     })
  //     .catch(e => {
  //       console.log(e);
  //     });
  // }

  render() {
    // let allComments = this.props.wallData.map(com => {
    //   return (
    //     <div key={com.id}>
    //       <p>{com.username}</p>
    //       <p>{com.comment}</p>
    //     </div>
    //   );
    // });

    return (
      // <div>
      <h1>Hellooooo</h1>

      // <div className="commentText" onChange={this.props.lineBreaks}>
      //   <div>{allComments}</div>
      // </div>
      // <span id="comment" onClick={this.props.toggleComment}>
      //   Post your comment here
      // </span>
      //
      // {this.props.commentBoxVisible && (
      //   <div>
      //     <div>
      //       <input
      //         type="username"
      //         id="comUN"
      //         name="userName"
      //         placeholder="username"
      //         onChange={this.props.setUsername}
      //       />
      //     </div>
      //     <div>
      //       <textarea
      //         name="comment"
      //         onChange={this.props.setComment}
      //         value={this.props.comment || ""}
      //       />
      //     </div>
      //     <button type="submit" onClick={this.props.sendComment}>
      //       Send comment
      //     </button>
      //   </div>
      // )}
      // </div>
    );
  }
}
