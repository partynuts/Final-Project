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


function insertImageData(url, id) {
  return db
  .query(`Update users
  Set profilePic=$1
  WHERE id=$2
  Returning *`, [url, id])
}

exports.insertImageData = insertImageData;


function insertBio(bio, id) {
  return db
  .query(`Update users
  Set bio=$1
  WHERE id=$2
  Returning *`, [bio, id])
}

exports.insertBio = insertBio;


function insertComments(username, comment, comment_id) {
  return db
  .query(`INSERT INTO comments (username, comment, comment_id)
  VALUES ($1, $2, $3)
  Returning *`, [username, comment, comment_id])
}

exports.insertComments = insertComments;


function displayComments(comment_id) {
  return db
  .query(`SELECT *
    FROM comments
    WHERE comment_id = $1
    ORDER BY timeSent DESC`, [comment_id])
}

exports.displayComments = displayComments;
