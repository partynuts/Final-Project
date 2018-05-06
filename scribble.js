axios.get("/comment")
  .then(response =>  {
    console.log(response.data);
    if (response.data.success) {
      for (let i = 0; i < response.data.wallData.length; i++) {
        this.wallData.unshift(response.data.wallData[i]);
        console.log(this.wallData[0].comment);

    } else {
        console.log("Error getting comments");
    }
  })
  .catch(e => {
    console.log(e);
  });



  app.get("/comment", function(req, res) {
        displayComments(req.session.user.id)
        .then(function(result) {
          console.log(result);
          result.rows.forEach(item => {
              let date = new Date (item.created_at);
              // console.log(date.toLocaleDateString());
                item.created_at = date.toLocaleDateString();
                // console.log(item.created_at);
          });
          res.json({
            wallData: result.rows,
          });
        })
        .catch(e => {
          console.log(e);
        });
      })
      .catch(e => {
        console.log(e);
      });
  });


  function pullOtherUsers(user_id) {
    `Select users.id, first, last `
  }

  let noFriendStatus = this.props.otherUsers.map(otherUser => {
    return (

    )
  })

  <span className="contacts">
    {" "}
    <Link to="/onlineUsers"> Contacts</Link>{" "}
  </span>
