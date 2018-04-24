
const bcrypt = require('bcryptjs');
function hashPassword(pw) {
  console.log('hashing pw');
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
              console.log('trouble in here');
                return reject(err);
            }
            bcrypt.hash(pw, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
}

exports.hashPassword = hashPassword;


function checkPassword(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
}

exports.checkPassword = checkPassword;
