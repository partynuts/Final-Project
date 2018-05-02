const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const { hashPassword, checkPassword } = require("./bcrypt");
const {
  setRegistration,
  setLogin,
  insertImageData,
  insertBio,
  insertComment,
  displayComments,
  getProfileInfo,
  makeFriendRequest,
  changeFriendshipStatus,
  checkFriendship,
  cancelFriendshipRequest,
  acceptFriendship
} = require("./db.js");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

const config = require("./config.json");

const diskStorage = multer.diskStorage({
  destination: function(req, file, callback) {
    callback(null, __dirname + "/uploads");
  },
  filename: function(req, file, callback) {
    uidSafe(24).then(function(uid) {
      //24 is the number of bytes --> size of the string. You can change it to another number if you want it bigger or smaller
      callback(null, uid + path.extname(file.originalname)); //extname will give the extension name of the uploaded file, i.e. png, img...
    });
  }
});
var uploader = multer({
  storage: diskStorage,
  limits: {
    //you can limit the size of the file, size of the file-name
    fileSize: 2097152 //limiting the files to 2 megabytes
  }
});

app.use(compression());
app.use(express.static("./public"));
app.use(
  cookieSession({
    secret: `Man's not hot`,
    maxAge: 1000 * 60 * 60 * 24 * 14 //expiration of the session (like on banking pages)
  })
);

app.use(bodyParser.json());

app.use(csurf());

app.use(function(req, res, next) {
  res.cookie("mytoken", req.csrfToken());
  next();
});

if (process.env.NODE_ENV != "production") {
  app.use(
    "/bundle.js",
    require("http-proxy-middleware")({
      target: "http://localhost:8081/"
    })
  );
} else {
  app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

// function requireLogin(req, res, next) {
//   if (!req.session.user) {
//     res.sendStatus(403);
//   } else {
//     next();
//   }
// }
//
// app.get('/user', requireLogin, (req, res) => {
//   db.getUserInfo(req.session.user)
// })

app.get("/userInfo", function(req, res) {
  setLogin(req.session.user.email)
    .then(function(result) {
      displayComments(req.session.user.id)
        .then(function(results) {
          // result.rows.forEach(item => {
          //     let date = new Date (item.timeSent);
          //       item.timeSent = date.toLocaleDateString();
          // });
          res.json({
            success: true,
            userData: result.rows[0],

            wallData: results.rows
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

app.get("/welcome", function(req, res) {
  if (req.session.user) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.get("/get-user/:userId", function(req, res) {
  console.log("match params in get user:", req.params);
  if (req.params.userId == req.session.user.id) {
    return res.json({
      sameProfile: true
    });
  }
  getProfileInfo(req.params.userId)
    .then(results => {
      res.json({
        success: true,
        first: results.rows[0].first,
        last: results.rows[0].last,
        profilePic: results.rows[0].profilepic,
        bio: results.rows[0].bio,
        id: results.rows[0].id,
        self: req.session.user.id,
        sameProfile: false
      });
    })
    .catch(e => {
      console.log(e);
    });
});

app.post("/register", function(req, res) {
  let first = req.body.first;
  let last = req.body.last;
  let email = req.body.email;
  let pw = req.body.pw;
  if (first && last && email && pw) {
    hashPassword(pw).then(function(results) {
      setRegistration(first, last, email, results)
        .then(function(result) {
          req.session.user = {
            id: result.rows[0].id,
            first: req.body.first,
            last: req.body.last,
            email: req.body.email
          };
          res.json({
            success: true,
            loggedIn: req.session.user.id
          });
        })
        .catch(e => {
          console.log(e);
        });
    });
  } else {
    res.json({
      success: false
    });
  }
});

app.post("/login", function(req, res) {
  let email = req.body.email;
  let pw = req.body.pw;
  if (email && pw) {
    setLogin(email).then(function(result) {
      let user = result.rows[0];
      if (!user) {
        res.json({
          success: false
        });
      }
      checkPassword(pw, result.rows[0].pw)
        .then(function(doesMatch) {
          console.log(doesMatch);
          if (doesMatch) {
            req.session.user = {
              id: result.rows[0].id,
              first: result.rows[0].first,
              last: result.rows[0].last,
              email: req.body.email
            };
            res.json({
              success: true,
              loggedIn: req.session.user.id
            });
          } else {
            console.log("not matching");
            res.json({
              success: false
              // logged: req.session.user.id
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    });
  } else {
    res.json({
      success: false
    });
  }
});

app.post("/uploader", uploader.single("file"), s3.upload, function(req, res) {
  if (req.file) {
    const imageUrl = config.s3Url + req.file.filename;
    insertImageData(imageUrl, req.session.user.id)
      .then(function(result) {
        res.json({
          success: true,
          userData: result.rows[0]
        });
      })
      .catch(e => {
        console.log(e);
      });
  } else {
    console.log("boo!");
    res.json({
      success: false
    });
  }
});

app.post("/bio", function(req, res) {
  if (req.body.bio) {
    insertBio(req.body.bio, req.session.user.id)
      .then(function(result) {
        res.json({
          success: true,
          bio: result.rows[0].bio
        });
      })
      .catch(e => {
        console.log(e);
      });
  } else {
    res.json({
      success: false
    });
  }
});

app.post("/comment", function(req, res) {
  if (req.body.comment && req.body.userName) {
    insertComment(req.body.comment, req.body.userName, req.session.user.id)
      .then(function(result) {
        res.json({
          success: true,
          wallData: result.rows[0]
          // comment: result.rows[0].comment,
          // username: result.rows[0].username
        });
      })
      .catch(e => {
        console.log(e);
      });
  } else {
    console.log("comment save FAILED!!");
    res.json({
      success: false
    });
  }
});

app.get("/friendship/:userId", function(req, res) {
  console.log("req params in friendship", req.params.userId);
  checkFriendship(req.session.user.id, req.params.userId)
    .then(function(result) {
      console.log("result FR",result);
      if (result.rows.length == 0) {
        res.json({
          success: true,
          status: 0,

        });
      } else {
        res.json({
          success: true,
          status:result.rows[0].status,
          receiver_id: result.rows[0].receiver_id,
          sender_id: result.rows[0].sender_id,
          friendshipId: result.rows[0].id,
          timestamp: result.rows[0].created_at,
          receivedRequest: req.session.user.id == result.rows[0].receiver_id
        });
      }
    })
    .catch(e => {
      console.log(e);
    });
});

app.post("/makeFriendship/:userId", function(req, res) {
  console.log("friend request firing");

  console.log("session user id", req.session.user.id);
  console.log("params user in make friendship", req.params.userId);
  makeFriendRequest(req.session.user.id, req.params.userId)
    .then(function(result) {
      console.log("result friend request", result);
      res.json({
        success: true,
        status: result.rows[0].status,
        receiver_id: result.rows[0].receiver_id,
        sender_id: result.rows[0].sender_id,
        friendshipId: result.rows[0].id,
        timestamp: result.rows[0].created_at
      });
    })
    .catch(e => {
      console.log(e);
    });
});

app.post("/cancelFriendship/:userId", function(req, res) {
  console.log("cancel firing. user Id", req.session.user.id);
  console.log("params userId in cancel fr", req.params.userId);

  cancelFriendshipRequest(req.session.user.id, req.params.userId)
    .then(function(result) {
      res.json({
        success: true,

      });
    })
    .catch(e => {
      console.log(e);
    });
});

app.post("/acceptFriendship/:userId", function(req, res) {
  console.log("accept firing");
  console.log("req params in accept friendship", req.params.userId);

  // checkFriendship(req.session.user.id, req.params.userId)
  //   .then(function(result) {
  //     if (result.rows[0].status == 1) {
  //       console.log("result in aFR fr-check", result);
        acceptFriendship(req.session.user.id, req.params.userId)
        .then(function(results) {
          console.log("rresult in aFR accepting", results);
          res.json({
            success: true,
            status: results.rows[0].status,
            // receiver_id: results.rows[0].receiver_id,
            // sender_id: results.rows[0].sender_id,
            // friendshipId: results.rows[0].id,
            // timestamp: results.rows[0].created_at,
            // receivedRequest: req.session.user.id == result.rows[0].receiver_id

          });
        })

      // } else {
      //   console.log("No fr pending!");
      // }
    // })
    .catch(e => {
      console.log(e);
    });
});

app.get("/logout", (req, res) => {
  console.log("logout route");
  req.session.user = null;
  res.redirect("/welcome");
});

app.get("*", function(req, res) {
  if (!req.session.user) {
    res.redirect("/welcome");
  } else {
    res.sendFile(__dirname + "/index.html");
  }
});

app.listen(8080, function() {
  console.log("I'm listening.");
});
