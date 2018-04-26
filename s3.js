const knox = require("knox");
const fs = require("fs");

let secrets;
if (process.env.NODE_ENV == "production") {
  secrets = process.env; // in prod the secrets are environment variables
} else {
  secrets = require("./secrets"); // secrets.json is in .gitignore
}
const client = knox.createClient({
  key: secrets.AWS_KEY,
  secret: secrets.AWS_SECRET,
  bucket: "partynuts"
});

exports.upload = function(req, res, next) {
  console.log(req.file.filename, req.file.mimetype);
  const s3Request = client.put(req.file.filename, {
    //multer has the filename and here I am putting a file with that name to amazon
    //these two following things are the headers that amazon sets
    "Content-Type": req.file.mimetype,
    "Content-Length": req.file.size,
    //this last thing is not a header but it says that everything we upload is publicly readable but not writeable
    "x-amz-acl": "public-read"
  });
  const fs = require("fs");
  const readStream = fs.createReadStream(req.file.path);
  readStream.pipe(s3Request);
  console.log('Hallooooo');
  s3Request.on("response", s3Response => {
    // console.log(s3Response);
    const wasSuccessful = s3Response.statusCode == 200;
    console.log(wasSuccessful);
    if (wasSuccessful) {
      next();
      fs.unlink(req.file.path, () => null) //delete pics from harddrive after uploading to amazon. and pass the unlink an empty function. this function is called noop!
    } else {
      res.sendStatus(500);
    }
  });
};
