import React from "react";
import axios from "../axios";
import {Link} from 'react-router-dom';

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
      <div className="formContainer">
        {this.state.error && <div className="errmsg">Something went wrong. Please try again</div>}
        <div className="form">
         <div className="inputs">
          <div>
            <input name="email" type="email" placeholder="E-Mail"  onChange={this.handleChange} />
            <label>E-Mail</label>
          </div>
          <div>
            <input name="pw"  type="password" placeholder="Password" onChange={this.handleChange} />
            <label>Password</label>
          </div>
          <button className="submitBtn" onClick={this.submit}>Log In</button>

        </div>
      </div>
      <div className="redirect">
        <div>Not registered yet? Create an<Link to="/">  account</Link>!</div>
      </div>
    </div>
    );
  }
}

const styleForm = {display: "block", fontWeight: "bold"};
