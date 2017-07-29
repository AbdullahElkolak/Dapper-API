/**
* Likes controller.
* Created by Kudzai Gopfa on 29/7/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const Like       =  require('mongoose').model('Like');
const Image      =  require('mongoose').model('Images');

let getErrorMessage = function(err) {
    if(err.errors) {
        var message = '';
        for(var i in err.errors) {
            if(err.errors[i].message) {
                message = err.errors[i].message;
            }
        }
        return message;
    } else {
        return 'Unknown server error';
    }
};

exports.like = function(req, res) {
    let like         =  {};
    like.liked_by   =  req.user;
    like.image       =  req.image;

    like.save(function(err) {
        if(err) {
            return res.status(400).send(getErrorMessage(err));
        } else res.json(comment);
    });
};

exports.list = function(req, res) {
    Like.find({image: req.image._id}).populate('liked_by', 'username').sort('-created').exec(function(err, likes) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(likes);
    });
};

exports.checkUser = function(req, res, next) {
    let comment = req.comment;
    if(!req.user.id === comment.posted_by.id) {
        res.status(403).send({
            message: 'Action only available to author'
        });
    } else next();
};

exports.unlike = function(req, res) {
    let comment = req.comment;

    comment.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(comment);
    });
};
