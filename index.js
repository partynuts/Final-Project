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
  displayComments
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

// app.get('/logout', (req, res) => {
//   req.session = null;
//   res.redirect('/welcome');
// })

app.get("/user", function(req, res) {
  console.log("req.session.user", req.session.user);
  setLogin(req.session.user.email)
    .then(function(result) {
      console.log("result in user get route:", result.rows);
      console.log("result.rows.first:", result.rows[0].first);
      displayComments(req.session.user.id)
      .then(function(results) {
        console.log(results);
        // result.rows.forEach(item => {
        //     let date = new Date (item.timeSent);
        //       item.timeSent = date.toLocaleDateString();
        // });
        console.log("results in display comments get route:", results);
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


app.post("/register", function(req, res) {
  console.log("TEST reg");
  let first = req.body.first;
  let last = req.body.last;
  let email = req.body.email;
  let pw = req.body.pw;
  console.log(req.body.email);
  if (first && last && email && pw) {
    hashPassword(pw).then(function(results) {
      console.log(results);
      setRegistration(first, last, email, results)
        .then(function(result) {
          console.log(result);

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
    console.log("error with registration!!");
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
        console.log("No user in db");
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
            console.log("matching pw and signature");
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
    console.log("missed field in login");
    res.json({
      success: false
    });
  }
});

app.post("/uploader", uploader.single("file"), s3.upload, function(req, res) {
  console.log("req.file:", req.file);

  if (req.file) {
    console.log("success!", req.file);
    const imageUrl = config.s3Url + req.file.filename;
    insertImageData(imageUrl, req.session.user.id)
      .then(function(result) {
        console.log("uploader result", result.rows);
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
  console.log("the bio text:", req.body);
  if (req.body.bio) {

    insertBio(req.body.bio, req.session.user.id)
      .then(function(result) {
        console.log("bio text reslut", result);
        res.json({
          success: true,
          bio: result.rows[0].bio
        });
      })
      .catch(e => {
        console.log(e);
      });
  } else {
    console.log("bio edit save FAILED!!");
    res.json({
      success: false
    });
  }
});

app.post("/comment", function(req, res) {
  console.log("the comment text:", req.body);
  if (req.body.comment && req.body.userName) {

    insertComment(req.body.comment, req.body.userName, req.session.user.id)
      .then(function(result) {
        console.log("comment text result", result);
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
