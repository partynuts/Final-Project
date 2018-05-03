import React from "react";
import axios from "../axios";
import { Logo } from "./logo.js";
import { Profile } from "./profile";
import { Uploader } from "./uploader";
import {BrowserRouter, Route, Link} from "react-router-dom";
import { Userprofile} from "./userprofile.js";
import {OtherProfile} from "./otherprofile.js";
import { connect } from 'react-redux';
import Friends from './friends';



export class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setFile = this.setFile.bind(this);
    this.changeImage = this.changeImage.bind(this);
    this.showUploader = this.showUploader.bind(this);
    this.setBio = this.setBio.bind(this);
    this.setComment = this.setComment.bind(this);
    this.logout = this.logout.bind(this);
    this.closeUploader = this.closeUploader.bind(this);
    // this.componentDidMount = this.componentDidMount.bind(this); ==> you do NOT bind life cycle functions
  }
  componentDidMount() {
    console.log("mounted!!!!!!!!");
    axios
      .get("/userInfo")
      .then(response => { //wenn man eine arrow fn  benutzt, wird der "Inhalt" des this von der vorherigen funktion übernommen.
        if (response.data.success) {
          console.log("response data", response.data);
          this.setState({
            userData: response.data.userData,
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

  logout() {
    axios.get("/logout", this.state.userData.id)
    .then(resp => {
      console.log("logging out");
       location.pathname = '/logout';
     })
  }

  showUploader() {
    console.log("modal is closed");
    this.setState({ uploaderIsVisible: !this.state.uploaderIsVisible })
  }

  closeUploader() {
    console.log("closing modal");
    this.setState({ uploaderIsVisible: false })
  }

  changeImage() {
    var formData = new FormData();
    formData.append("file", this.state.file);
    axios.post("/uploader", formData)
    .then(resp => {
      if (resp.data.success) {
      // profillePic muss wieder in einem Objekt nämlich userData sein.
      this.setState ({
        userData: resp.data.userData
      }, function() {
        console.log(this.state);
      })
      this.setState({ uploaderIsVisible: false })

    }
    })
    .catch(e => {
      console.log(e);
    })
  }
  setFile(e) {
    let selectedImage = new FileReader();
       selectedImage.readAsDataURL(e.target.files[0]);
       selectedImage.addEventListener("load", () => {
       this.setState({ selectedImage: selectedImage.result });
       });
      this.setState({
      file: e.target.files[0]
    })
  }
  setBio(e) {
    this.setState({
      userData: {
        ...this.state.userData,
        bio: e.target.value
      }
    },
  function () {
    console.log(this.state);
  })
  }
  setComment(e) {
    this.setState({
      wallData: {
        ...this.state.wallData,
        comment: e.target.value,
        username: this.username
      }
    }, function() {
      console.log("this.state in set Comment:",this.state.wallData);
    })
  }




  render() {
    return (
      <div>
        <header className="headerProfile">
        <div className="headLeft">
          <Logo small = { "small" } />
        </div>
        <div className="headRight">
          {this.state.userData && <Profile
              profilePic={this.state.userData.profilepic}
              first={this.state.userData.first}
              logout={this.logout}
              showUploader = {() => this.setState({uploaderIsVisible: true})}
            /> }

        {this.state.uploaderIsVisible && <Uploader {...this.state}
            changeImage={this.changeImage}
            closeUploader = {this.closeUploader}
            setFile={this.setFile}
           /> }


          </div>
        </header>

        <BrowserRouter>
          <div>
          {this.state.userData &&
          <div>
            <Route
              exact path="/"
              render={() => {
                return (
                   <Userprofile
                  id={this.state.userData.id}
                  first={this.state.userData.first}
                  last={this.state.userData.last}
                  profilePic={this.state.userData.profilepic}
                  bio={this.state.userData.bio}
                  setBio={this.setBio}
                  wallData={this.state.wallData}
                  setComment={this.setComment}
                  />
                )
              }}

            />
          </div>
          }
          <Route
            exact path="/friendslist"
            component={Friends}
            />

          <Route
            exact path="/user/:userId"
            component={OtherProfile} />

          </div>
        </BrowserRouter>

      </div>

      );

  }
}
