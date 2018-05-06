setComment={this.props.setComment}
setUsername={this.props.setUsername}
lineBreaks={this.lineBreaks}
comment={this.props.wallData.comment}
sendComment={this.sendComment}
username={this.props.wallData.username}
wallData={this.props.wallData}
commentBoxVisible={this.state.commentBoxVisible}
toggleComment={this.toggleComment}


if (!this.props.wallData) {
  return <div className="loader">Loading...</div>;
}
