import React from "react";
import axios from "../axios";

export class Comment extends React.Component {
  console.log("props inside of comment", props);
  constructor(props) {
    super(props);
    this.state = {};
    this.setComment = this.setComment.bind(this);
    this.setUsername = this.setUsername.bind(this);
  }

  componentDidMount() {
    console.log("mounted!!!!!!!!");
    axios
      .get("/userInfo")
      .then(response => { //wenn man eine arrow fn  benutzt, wird der "Inhalt" des this von der vorherigen funktion übernommen.
        if (response.data.success) {
          console.log("response data", response.data);
          this.setState({
            wallData: response.data.wallData
          },
        function (){
          console.log(this.state);
        });
        } else {
          console.log("Errooooooor");
        }
      })
      .catch(e => {
        console.log(e);
      });

  }

  setComment(e) {
    this.setState({
      wallData: {
        ...this.state.wallData,
        comment: e.target.value
      }
    }, function() {
      console.log("this.state in set Comment:",this.state.wallData);
    })
  }
setUsername(e) {
  this.setState({
    wallData: {
      ...this.state.wallData,
      username: e.target.value
    }
  })
}

  sendComment() {
    console.log("comment sending fn firing");
    axios
      .post("/comment", {
        comment: this.props.wallData.comment,
        username: this.props.wallData.username
      })
      .then(resp => {

        if (resp.data.success) {
          console.log("Response Data:", resp);
          this.setState({ wallData: resp.data.wallData });
          this.setState({ commentBoxVisible: false });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }


  if (!props.wallData) {
    return null;
  }

  let allComments = props.wallData.map(com => {
    return (
      <div key={com.id}>
        <p>{com.username}</p>
        <p>{com.comment}</p>
      </div>
    );
  });

  return (
    <div>
      <div className="commentText" onChange={props.lineBreaks}>
        <div>{allComments}</div>

      </div>
      <span id="comment" onClick={props.toggleComment}>
        Post your comment here
      </span>

      {props.commentBoxVisible && (
        <div>
          <div>
            <input
              type="username"
              id="comUN"
              name="userName"
              placeholder="username"

            />
          </div>
          <div>
            <textarea
              name="comment"

            />
          </div>
          <button type="submit" onClick={props.sendComment}>
            Send comment
          </button>
        </div>
      )}
    </div>
  );
}
