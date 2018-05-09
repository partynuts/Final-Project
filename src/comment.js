import React from "react";
import axios from "../axios";
import { sendComment, setComment, getAllComments } from "./action";
import { connect } from "react-redux";
import { reducer } from "./reducer";

class Comment extends React.Component {
  constructor(props) {
    console.log("props in cons", props);
    super(props);

    this.userinput = "";
    this.lineBreaks = "";
    this.commentBoxVisible = false;
    // this.img = null;
    this.state = {
      url: ""
    };
    this.display = this.display.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    console.log("thisCOMMENT", this);
    this.props.dispatch(getAllComments(this.props.receivingUserId));
  }
  compileInput(e) {
    this.userinput = e.target.value;
  }
  lineBreaks(e) {
    if (e.keyCode == 13) {
      commentText.textContent = e.target.value;
    }
  }
  toggleComment() {
    console.log("Comment Box opening");
    this.commentBoxVisible = !this.commentBoxVisible;
  }
  // getUrl() {
  //   const url = prompt("Enter image URL");
  //
  //   if (url) {
  //     // Do string and URL validation here and also for image type
  //     // let img = url;
  //     this.img = url;
  //     console.log("image url", this.img);
  //
  //     // let slider = document.getElementById("slider")[0];
  //     // slider.push(img);
  //     // slider.insertBefore(img, document.getElementById("img")[0]);
  //   } else {
  //     return getUrl();
  //   } //`.slider image.src = getUrl();`
  // }

  handleChange(e) {
    // const url = prompt("Enter image URL");
    this.setState({
      url: e.target.value
    });
  }
  display() {
    return this.url;
  }

  render() {
    if (!this.props) {
      console.log("this im render der comment comp", this.props);
      return null;
    } else {
      console.log("this im render der comp", this);
      return (
        <div>
          <div className="commentBox">
            <h1 onClick={() => this.toggleComment()} />
            <div>
              <textarea
                className="commentTextarea"
                onChange={e => this.compileInput(e)}
              />
            </div>
            <button
              className="comBtn"
              type="submit"
              onClick={() =>
                this.props.dispatch(
                  sendComment(this.userinput, this.props.receivingUserId)
                )
              }
            >
              Send comment
            </button>
          </div>

          <div className="commentsBox">
            {this.props.allComments &&
              this.props.allComments.map(userComments => {
                if (
                  userComments.comment.includes(".png") ||
                  userComments.comment.includes(".gif") ||
                  userComments.comment.includes(".jpg") ||
                  userComments.comment.includes(".jpeg")
                ) {
                  userComments.commentpic = userComments.comment;
                  userComments.comment = "";
                }
                return (
                  <div key={userComments.timesent} className="userComments">
                    <div className="userNameComment">
                      {" "}
                      {userComments.first}
                      {userComments.last}
                    </div>
                    <div className="timeSent">{userComments.timesent}</div>

                    <div
                      className="commentText"
                      onChange={e => this.lineBreaks(e)}
                    >
                      {userComments.comment}
                    </div>
                    <img id="img" src={userComments.commentpic} />
                  </div>
                );
              })}
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = function(state) {
  return {
    allComments: state.allComments
  };
};

export default connect(mapStateToProps)(Comment);
