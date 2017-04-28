var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
// Json Web Token options object (see passport-jwt documentation)
var JWTOptions = {};
// Parse the json web token contained in an oncoming request
JWTOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
// Set secret/key for verifying the token's signature
JWTOptions.secretOrKey = '1_L0V3_P13';


module.exports = {
    db_url: 'mongodb://localhost/imageuploadertest',
    sessionSecret: 'supersecret',
    jwtOptions: JWTOptions
}
