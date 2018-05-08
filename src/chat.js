import React from "react";
import axios from "../axios";
import { connect } from "react-redux";
// import {  } from "./action";
import { Link } from "react-router-dom";

class Chat extends React.Component {
  constructor(props) {
    console.log("props in cons", props);

    super(props);
    this.userinput = "";
    let tenRecentMsgs = [];
  }
  compileInput(e) {
    this.userinput = e.target.value;
    this.tenRecentMsgs = tenRecentMsgs.push(this.userinput);
  }

  render() {
    if (!props.chatMsgs) {
      return null;
    } else {
      return (
        <div className="chatBox">
          <h5>Here is the chat</h5>
          <div className="chatMsgs">{this.tenRecentMsgs}</div>
          <div className="chatTextBox">
            <textarea onClick={e => this.compileInput(e)} />
          </div>
        </div>
      );
    }
  }
}

export default connect()(Chat);
