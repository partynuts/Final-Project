const knox = require( "knox" );
const fs = require( "fs" );

let secrets;
if ( process.env.NODE_ENV == "production" ) {
	secrets = process.env; // in prod the secrets are environment variables
} else {
	secrets = require( "./secrets" ); // secrets.json is in .gitignore
}
const client = knox.createClient( {
	key: secrets.AWS_KEY,
	secret: secrets.AWS_SECRET,
	bucket: "partynuts"
} );

exports.upload = function( req, res, next ) {
	const s3Request = client.put( req.file.filename, {

		"Content-Type": req.file.mimetype,
		"Content-Length": req.file.size,
		"x-amz-acl": "public-read"
	} );
	const fs = require( "fs" );
	const readStream = fs.createReadStream( req.file.path );
	readStream.pipe( s3Request );
	s3Request.on( "response", s3Response => {
		const wasSuccessful = s3Response.statusCode == 200;
		if ( wasSuccessful ) {
			next();
			fs.unlink( req.file.path, () => null ) //delete pics from harddrive after uploading to amazon. and pass the unlink an empty function. this function is called noop!
		} else {
			res.sendStatus( 500 );
		}
	} );
};