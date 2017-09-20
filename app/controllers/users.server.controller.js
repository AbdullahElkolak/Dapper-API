/**
* User controller.
* Created by Kudzai Gopfa on 3/5/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const path       =  require('path');
const fs         =  require('fs');
const Busboy     =  require('busboy');
const mongoose   =  require('mongoose');
const config     =  require('../../config/env/development.js');
const jwt        =  require('jsonwebtoken');

/**
* Models
*/

const User       =  mongoose.model('Users');
const Follow     =  mongoose.model('Follow');

let getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Oops! Something went wrong, please try again later.';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }
    return message;
};

function generateJWT(user) {
    let tokenExpiryDate = new Date();
    tokenExpiryDate.setDate(tokenExpiryDate.getDate() + 7);

    return jwt.sign({
        _id: user._id,
        username: user.username,
        exp: parseInt(tokenExpiryDate.getTime()/1000)
    }, config.JWT_SECRET);
}

exports.upload = function(req, res) {
    const s3       = new aws.S3();

    const s3Params = {
        Bucket: config.S3_BUCKET,
        Expires: 200,
        ACL: 'public-read'
    };

    let user     =  req.user;
    let busboy   =  new Busboy({ headers: req.headers });
    let imgID    = '';

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        let ext    =  path.extname(filename).toLowerCase();

        imgID  = 'uploads/avatar/user_' + req.user._id + ext;

        let options = {partSize: 10 * 1024 * 1024, queueSize: 1};

        s3Params.Key          =  imgID;
        s3Params.ContentType  =  mimetype;
        s3Params.Body         =  file;

        console.log("S3 Parameters: " + JSON.stringify(s3Params));

        s3.upload(s3Params, options, (err, data) => {
            if(err){
                console.log(err);
                return res.send({message: 'Oops! Something went wrong, Try Again.'});
            }

            const returnData = {
                signedRequest: data,
                url: `https://${config.S3_BUCKET}.s3.amazonaws.com/${imgID}`
            };
        });
    });

    user.avatar = 'https://' + config.S3_BUCKET + '.s3.amazonaws.com/' + imgID;

    busboy.on('finish', function() {
        user.save(function(err) {
            if(err) {
                console.log(err);
                return res.send({message: getErrorMessage(err)});
            } else res.json(image);
        });
    });

    return req.pipe(busboy);
};


exports.create = function(req, res) {
    if(!req.user) {
        let user = new User(req.body);
        user.provider = 'local';

        user.save(function (err, user) {
            if(err) {
                console.log(err);
                return res.status(400).send({message: getErrorMessage(err)});
            } else {
                let follow = new Follow({follower: user._id, following: user._id});

                follow.save(function(err) {
                    if(err) {
                        console.log(err);
                        res.status(400).send({message: getErrorMessage(err)})
                    }
                });

                let token = generateJWT(user);
                return res.send({
                    message: "Ok",
                    token: 'JWT ' + token
                });
            }
        });
    }
};

exports.userByID = function(req, res, next, id) {
    User.findOne({_id: id}, '-salt -password -__v -provider', function(err, user) {
        if(err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }
        if(!user) {
            return next(new Error('User not found'));
        }
        else {
            req.profile = user;
        }
        next();
    });
};

exports.list = function(req, res) {
    User.find({}, '-salt -password -__v -provider').exec(function(err, users) {
        if(err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(users);
    });
};

exports.read = function(req, res) {
    res.json({
        profile   : req.profile,
        followers : req.followers.length,
        following : req.following.length
    });
};

exports.delete = function(req, res) {
    let user = req.user;

    User.remove(function(err) {
        if(err) {
            console.log(err);
            return res.send({message: getErrorMessage(err)});
        } else {
            req.logout();
        }
    });
};

exports.update = function(req, res) {
    let userdata = new User(req.body);

    User.findOneAndUpdate({
            _id: req.user._id
        }, userdata, {new: true}, function(err, user) {
            if(err) {
                console.log(err);
                return res.send({message: getErrorMessage(err)});
            } else {
                return res.json(user);
            }
        });
};

exports.email = function(req, res) {
    User.findOne({
        email: req.body.email.toLowerCase()
    }, function(err, user) {
        if (err) {
            console.log(err);
            return res.send({
				message: getErrorMessage(err),
				userContinue: false
			});
        } else if (user) {
            return res.send({
				message: "Email is already in use",
				userContinue: false
			});
        } else return res.send({
			message: "Ok",
			userContinue: true
		});
    });
};

exports.username = function(req, res) {
    User.findOne({
        username: req.body.username.toLowerCase()
    }, function(err, user) {
        if (err) {
            console.log(err);
            return res.send({
				message: getErrorMessage(err),
				userContinue: false
			});
        } else if (user) {
            return res.send({
				message: "Username is already in use",
				userContinue: false
			});
        } else return res.send({
			message: "Ok",
			userContinue: true
		});
    });
};

exports.login = function(req, res) {
    let userCRED = req.body.userCRED;
    let password = req.body.password;
    // Check whether user provides email or username
    let criteria = (userCRED.indexOf('@') === -1) ? {username: userCRED.toLowerCase()} : {email: userCRED.toLowerCase()};

    User.findOne(criteria, function(err, user){
        if (err) {
            console.log(err);
            return res.send({message: getErrorMessage(err)});
        }
        else if(!user) {
            return res.send({message: 'Incorrect username and password combination!'});
        }
        else if (user.authenticate(password)) {
            let token = generateJWT(user);
            return res.send({
                success: true,
                token: 'JWT ' + token
            });
        } else return res.status(401).send({message: "Incorrect username and password combination!"});
    });
};

/**
  * @ToDo: Unsign JWT on logout
  * STEPS:
  *    1. Research
**/

exports.logout = function(req, res) {
    req.logout();
};
