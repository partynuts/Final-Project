const spicedPg = require("spiced-pg");

let db;

if (process.env.DATABASE_URL) {
  db = spicedPg(process.env.DATABASE_URL);
} else {
  db = spicedPg("postgres://postgres:postgres@localhost:5432/socialnetwork");
}

function setRegistration(first, last, email, pw) {
  return db.query(
    `INSERT INTO users (first, last, email, pw)
  VALUES ($1, $2, $3, $4)
  RETURNING id`,
    [first, last, email, pw]
  );
}

exports.setRegistration = setRegistration;

function setLogin(mail) {
  return db.query(
    `SELECT *
    FROM users
    WHERE email = $1`,
    [mail]
  );
}

exports.setLogin = setLogin;

function insertImageData(url, id) {
  return db.query(
    `Update users
  Set profilePic=$1
  WHERE id=$2
  Returning *`,
    [url, id]
  );
}

exports.insertImageData = insertImageData;

function insertBio(bio, id) {
  return db.query(
    `Update users
  Set bio=$1
  WHERE id=$2
  Returning *`,
    [bio, id]
  );
}

exports.insertBio = insertBio;

function insertComments(comment, commentingUser_id, receivingUser_id) {
  return db.query(
    `INSERT INTO comments (comment, commentingUser_id, receivingUser_id)
  VALUES ($1, $2, $3)
  Returning *`,
    [comment, commentingUser_id, receivingUser_id]
  );
}

exports.insertComments = insertComments;

function displayComments(receivingUser_id) {
  return db.query(
    `SELECT *
    FROM comments
    JOIN users
    ON commentingUser_id = users.id
    WHERE receivingUser_id = $1
    ORDER BY timeSent DESC`,
    [receivingUser_id]
  );
}

exports.displayComments = displayComments;

function getProfileInfo(userId) {
  return db.query(
    `SELECT *
    FROM users

    WHERE id = $1`,
    [userId]
  );
}

exports.getProfileInfo = getProfileInfo;

function makeFriendRequest(sender_id, receiver_id) {
  return db.query(
    `Insert INTO friendships (sender_id, receiver_id, status)
  VALUES ($1, $2, 1)
  RETURNING *`,
    [sender_id, receiver_id]
  );
}

exports.makeFriendRequest = makeFriendRequest;

function cancelFriendshipRequest(sender_id, receiver_id) {
  return db.query(
    `Delete from friendships
    WHERE (sender_id =$1 AND receiver_id=$2) OR (receiver_id =$1 AND sender_id=$2)`,
    [sender_id, receiver_id]
  );
}

exports.cancelFriendshipRequest = cancelFriendshipRequest;

function checkFriendship(sender_id, receiver_id, id) {
  return db.query(
    `SELECT *
    FROM friendships
    WHERE (sender_id =$1 AND receiver_id=$2) OR (receiver_id =$1 AND sender_id=$2)`,
    [sender_id, receiver_id]
  );
}

exports.checkFriendship = checkFriendship;

function acceptFriendship(sender_id, receiver_id) {
  return db.query(
    `UPDATE friendships
    SET status=2
    WHERE (sender_id=$1 AND receiver_id=$2) OR (receiver_id =$1 AND sender_id=$2)
    Returning *`,
    [sender_id, receiver_id]
  );
}

exports.acceptFriendship = acceptFriendship;

function pullFriendsList(user_id) {
  return db.query(
    `SELECT users.id, first, last, profilePic, status
    FROM friendships
    JOIN users
    ON (status = 1 AND receiver_id = $1 AND sender_id = users.id)
    OR (status = 2 AND receiver_id = $1 AND sender_id = users.id)
    OR (status = 2 AND sender_id = $1 AND receiver_id = users.id)`,
    [user_id]
  );
}

exports.pullFriendsList = pullFriendsList;

function pullOtherUsers(user_id) {
  return db.query(
    `Select users.id, users.first, users.last, users.profilePic, friendships.status, friendships.receiver_id, friendships.sender_id
    FROM users
    Left JOIN friendships
    ON (receiver_id=$1 AND (status = 2 OR status=1) AND users.id = sender_id)
    OR (sender_id = $1 AND (status = 2 OR status = 1) AND users.id = receiver_id)
    WHERE status is null`,
    [user_id]
  );
}

exports.pullOtherUsers = pullOtherUsers;

function getUsersByIds(arrayOfIds) {
  const query = `
    SELECT *
    FROM users
    WHERE id = ANY($1)`;
  return db.query(query, [arrayOfIds]);
}

exports.getUsersByIds = getUsersByIds;
