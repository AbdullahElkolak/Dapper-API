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
const User       =  mongoose.model('Users');
const config     =  require('../../config/env/development.js');
const jwt        =  require('jsonwebtoken');

let getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'Username already exists';
                break;
            default:
                message = 'Something went wrong';
        }
    } else {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                message = err.errors[errName].message;
        }
    }
    return message;
};

function createID(possible, name) {
    for(var i = 0; i < 12; i++) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return name;
}

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
    let user = req.user;

    let busboy = new Busboy({ headers: req.headers });
    let ext = '', possiblename = '';

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        ext = path.extname(filename).toLowerCase();

        let possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
            imgID = createID(possible, possiblename) + ext;

        let saveTo = path.join('./uploads/profile', imgID);

        user.avatar = imgID;

    		user.save(function(err) {
            if(err)
                return res.send({message: getErrorMessage(err)});
            else
                return res.send({message: "Created"});
    		});

        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('finish', function() {
        console.log('Avatar Upload complete');
    });

    return req.pipe(busboy);
};


exports.create = function(req, res) {
    if(!req.user) {
        let user = new User(req.body);
        user.provider = 'local';

        user.save(function (err) {
            if(err) {
                return res.send({message: getErrorMessage(err)});
            } else {
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
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(users);
    });
};

exports.read = function(req, res) {
    res.json(req.profile);
};

exports.delete = function(req, res) {
    let user = req.user;

    User.remove(function(err) {
        if(err) {
            return res.send({message: 'Oops! Something went wrong.'});
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
            return res.send({message: 'An error occurred, Please Try Again'});
        } else if (user) {
            return res.send({message: "Email is already in use"});
        } else return res.send({message: "Continue"});
    });
};

exports.username = function(req, res) {
    User.findOne({
        username: req.body.username.toLowerCase()
    }, function(err, user) {
        if (err) {
            return res.send(getErrorMessage(err));
        } else if (user) {
            return res.send({message: "Username is already in use"});
        } else return res.send({message: "Ok"});
    });
};

exports.login = function(req, res) {
    let userCRED = req.body.userCRED;
    let password = req.body.password;
    // Check whether user provides email or username
    let criteria = (userCRED.indexOf('@') === -1) ? {username: userCRED.toLowerCase()} : {email: userCRED.toLowerCase()};

    User.findOne(criteria, function(err, user){
        if (err) {
            return res.send({message: getErrorMessage(err)});
        }
        else if(!user) {
            return res.send({message: 'Username/Email not found!'});
        }
        else if (user.authenticate(password)) {
            let token = generateJWT(user);
            return res.send({
                success: true,
                token: 'JWT ' + token
            });
        } else return res.status(401).send({message: "Incorrect password! Please try again."});
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
