import React from "react";
import axios from "../axios";


export function Comment(props) {
console.log("props inside of comment", props);


  return (

      <div >
        <div className="commentText" onChange={props.lineBreaks}>
          {props.comment}
          {props.username}
          {props.sentTime}
        </div>
        <span id="comment" onClick={props.toggleComment}>Post your comment here</span>

        {props.commentBoxVisible &&
        <div>
          <div>

            <input type="username" id="comUN" name="userName" placeholder="username" onChange={props.setComment} value={props.username || ''}/>
          </div>
          <div>

            <textarea name="comment" onChange={props.setComment} value={props.comment || ''}></textarea>
          </div>
        <button type="submit" onClick={props.comment}>Send comment</button>
        </div>
        }

      </div>


  )

}
