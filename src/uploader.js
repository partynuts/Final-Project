import React from "react";
import axios from "../axios";

export function Uploader(props) {
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
        <img id="modalImg" src={newPic} />

          <input type="file" className="inputfile" onChange={props.setFile} />

        <button className="submitBtn" type="submit" onClick={props.changeImage}>
          {" "}
          Submit{" "}
        </button>
      </div>
    </div>
  );
}
