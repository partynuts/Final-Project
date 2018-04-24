import React from "react";
import axios from "../axios";


export class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.handleChange = this.handleChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleChange(e) {
    this[e.target.name] = e.target.value;
  }

  submit() {
    axios.post("/login", {
        email: this.email,
        pw: this.pw
      })

      .then(resp => {
        if (resp.data.success) {
          location.replace("/");
        } else {
          this.setState({
            error: true
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    return (
      <div>
        {this.state.error && <div className="errmsg">Something went wrong. Please try again</div>}
        <div>
          <input name="email" placeholder="E-Mail" onChange={this.handleChange} />
          <input name="pw" placeholder="Password" type="password" onChange={this.handleChange} />
          <button onClick={this.submit}>Log In</button>
        </div>
      </div>
    );
  }
}

const styleForm = {display: "block", fontWeight: "bold"};
