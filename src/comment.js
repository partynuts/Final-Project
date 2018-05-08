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

  render() {
    if (!this.props) {
      console.log("this im render der comment comp", this.props);
      return null;
    } else {
      console.log("this im render der comp", this);
      return (
        <div>
          <div className="commentBox">
            <h1 onClick={() => this.toggleComment()}>Hellooooo</h1>
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
            {this.file && <img src={this.file} />}

            {this.props.allComments &&
              this.props.allComments.map(userComments => {
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
