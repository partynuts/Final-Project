import React from "react";
import axios from "../axios";
import { sendComment, setComment, getAllComments } from "./action";
import { connect } from "react-redux";
import { reducer } from "./reducer";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.userinput = "";
  }
  componentDidMount() {
    console.log("thisCOMMENT", this);

    this.props.dispatch(getAllComments());
  }
  compileInput(e) {
    this.userinput = e.target.value;
  }
  render() {
    if (!this.props) {
      console.log("this im render der comment comp", this.props);
      return "LEEEEEEEEEEEEEEEEEEEEEEEEEEEEERRRRRRRRRRRRRRR!!!!!!";
    } else {
      return (
        <div>
          <h1>Hellooooo</h1>

          <div>
            <textarea onChange={e => this.compileInput(e)} />
          </div>

          <div>
            <button
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
