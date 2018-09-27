/**
* Images controller.
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
const aws        =  require('aws-sdk');
const config     =  require('../../config/env/development.js');

/**
* Models
*/

const Images     =  mongoose.model('Images');
const Follow     =  mongoose.model('Follow');

/**
* Environment variables
*/

const S3_BUCKET    = process.env.S3_BUCKET;
aws.config         = config.AWS;

let getErrorMessage = function(err) {
    if(err.errors) {
        var message = '';
        for (var i in err.errors) {
            if (err.errors[i].message) {
                message = err.errors[i].message;
            }
        }
        return message;
    } else {
        return "Oops! Something went wrong, please try again later.";
    }
};

function createID() {
    let possible = 'abcdefghijklmnopqrstuvwyz', name = '';
    for(var i = 0; i < 8; i++) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return name;
}

exports.upload = function(req, res) {
    let image    =  new Images();
    let busboy   =  new Busboy({headers: req.headers});

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        let ext    =  path.extname(filename).toLowerCase();
        let imgID  = 'uploads/content/user_' + req.user._id + '/' + createID() + ext;

        const s3Options = {partSize: 10 * 1024 * 1024, queueSize: 1};

        const s3Params = {
            Bucket: config.S3_BUCKET,
            Key: imgID,
            Body: file
        }

        console.log("Content: " + JSON.stringify(s3Params));

        let s3 = new aws.S3();

        s3.upload(s3Params, s3Options, (err, data) => {
            if(err){
                console.log(err);
                return res.send({message: 'Oops! Something went wrong, Try Again.'});
            }

            const returnData = {
                signedRequest: data,
                url: `https://${config.S3_BUCKET}.s3.amazonaws.com/${imgID}`
            };
        });

        image.image_url = 'https://' + config.S3_BUCKET +'.s3.amazonaws.com/' + imgID;
    });

    busboy.on('field', function(fieldname, description) {
        image.description = description;
    });

    image.posted_by       =  req.user;
    image.user            =  {
                                username : req.user.username,
                                avatar   : req.user.avatar
                             }

    busboy.on('finish', function() {
        image.save(function(err) {
            if(err) {
                console.log(err);
                return res.send({message: getErrorMessage(err)});
            } else res.json(image);
        });
    });

    return req.pipe(busboy);
};

exports.imageByID = function(req, res, next, id) {
    Images.findOne({_id: id}).populate('author', 'username').exec(function(err, image) {
        if(err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }
        if(!image) {
            return next(new Error('Failed to load article' + id));
        }
        else {
            req.image = image;
        }
        next();
    });
};

exports.read = function(req, res) {
    res.json(req.image);
};

exports.list = function(req, res) {
    Follow.aggregate([
      { "$match": {follower: escape(req.user._id)}},
      { "$lookup":{
          from: 'Images',
          localField: 'following',
          foreignField: 'posted_by',
          as: 'content'
      }}
    ]).exec(function(err, content) {
        if(err) {
            console.log(err);
            return res.status(400).send({message: getErrorMessage(err)});
        } else res.json(content);
    });
};

exports.checkUser = function(req, res, next) {
    let image = req.image;
    if(!(escape(req.user._id) === escape(image.posted_by._id))) {
        res.status(403).send({
            message: 'Action only available to author'
        });
    } else next();
};

exports.update = function(req, res) {
    let image = req.image;
    if(req.user._id === image.posted_by) {
        image.description = req.body.description;

        image.save(function(err) {
            if(err) {
                console.log(err);
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else res.send({
                result    : image,
                success   : true
            });
        });
    } else {
        return res.send({
            success: false,
            message: "This action is only available to the author."
        });
    }
};

exports.delete = function(req, res) {
    let image = req.image;

    image.remove(function(err) {
        if(err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
    });
};
