const spicedPg = require("spiced-pg");

let db;

if (process.env.DATABASE_URL) {
  db = spicedPg(process.env.DATABASE_URL);
} else {
  db = spicedPg("postgres://postgres:postgres@localhost:5432/socialnetwork");
}


function setRegistration(first, last, email, pw) {
  return db
  .query(`INSERT INTO users (first, last, email, pw)
  VALUES ($1, $2, $3, $4)
  RETURNING id`, [first, last, email, pw])
}

exports.setRegistration = setRegistration;

function setLogin(mail) {
  return db
  .query(`SELECT *
    FROM users
    WHERE email = $1`, [mail]);
 
}

exports.setLogin = setLogin;
