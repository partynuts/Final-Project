import React from "react";
import axios from "../axios";


export function Bio(props) {
console.log("props inside of bio", props);


  return (


      <div >
        <div className="bioText" onChange={props.lineBreaks}>
          {props.bio}
        </div>
        <span id="bioEdit" onClick={props.toggleBio}>Edit your story</span>

        {props.bioBoxVisible &&
          <div>
            <textarea name="bio" onChange={props.setBio} value={props.bio || ''}></textarea>

            <button className="bioChangeBtn" type="submit" onClick={props.changeBio}>Change story</button>
          </div>
        }

      </div>


  )

}
