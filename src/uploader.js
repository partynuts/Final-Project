import React from "react";
import axios from "../axios";

export function Uploader(props) {
  console.log("props", props);
  let newPic = props.userData.profilepic;
  if (!props.selectedImage) {
    newPic = props.userData.profilepic;
  } else {
    newPic = props.selectedImage;
  }

  return (
    <div className="uploadModal">
      <span className="closeBtn" onClick={props.closeUploader}>
        x
      </span>
      <div className="uploadBox">
        <input type="file" onChange={props.setFile} />
        <img id="modalImg" src={newPic} />
        <button className="submitBtn" type="submit" onClick={props.changeImage}>
          {" "}
          Submit{" "}
        </button>
      </div>
    </div>
  );
}
