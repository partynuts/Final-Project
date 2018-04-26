class App extends React.Component {
constructor(props) {
super(props);
this.state = {};
this.uploaderShoudBeVisible = this.uploaderShoudBeVisible.bind(this)
}
componentDidMount() {
axios.get(‘/user’).then(resp => {
this.setState({
first: resp.data.first,
profilePic: resp.data.profilePic
})
})
}
showUploader() {
this.setState({
uploaderShoudBeVisible: true
});
}
render() {				// render gets called everytime the state changes.
if (!this.state.user) {
return null;
//oder return <img src=”spinner.gif” />
}
return (
<div >
<header>
<Logo />
Hi, {this.state.first}
// option 1
// <ProfilePic {...this.state} />			// this will return everything in the state object
option 2
<ProfilePic
id={this.state.id}
profilePic={this.state.profilePic}
first={this.state.first}
last={this.state.last}
makeUploaderVisible = {() => this.setState({uploaderShoudBeVisible: true})
/>
{this.state.uploaderShoudBeVisible && <Uploader changeImage={img => this.setState({
profilePic: img,
uploaderShoudBeVisible: false
})
} /> } // uploaderShoudBeVisible is a Boolean. needs to change in state when clicking on profile pic. you do that with a fn uploaderShoudBeVisible
</header>
</div>
)
}
}
