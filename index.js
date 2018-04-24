const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const { hashPassword, checkPassword } = require("./bcrypt");
const { setRegistration, setLogin } = require("./db.js");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");


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

app.use(function(req, res, next){
    res.cookie('mytoken', req.csrfToken());
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
            last: req.body.last
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
      })
      }
      checkPassword(pw, result.rows[0].pw)
        .then(function(doesMatch) {
          console.log(doesMatch);
          if (doesMatch) {
            req.session.user = {
              id: result.rows[0].id,
              first: result.rows[0].first,
              last: result.rows[0].last
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
