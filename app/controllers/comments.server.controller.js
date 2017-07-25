/**
* Comments controller.
* Created by Kudzai Gopfa on 3/5/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const Comment    =  require('mongoose').model('Comment');
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

exports.create = function(req, res) {
    let comment         = new Comment(req.body);
    comment.posted_by   =  req.user;
    comment.image       =  req.image;

    comment.save(function(err) {
        if(err) {
            return res.status(400).send(getErrorMessage(err));
        } else res.json(comment);
    });
};

exports.update = function(req, res) {
    let comment      = req.comment;
    comment.comment  = req.body.comment;
    comment.updated  = new Date();

    if(escape(comment.posted_by) === escape(req.user._id)) {
        comment.save(function(err) {
            if(err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else res.json(comment);
        });
    } else res.status(401).send({message: "Action only available to author"});
};

exports.list = function(req, res) {
    Comment.find({image: req.image._id}).sort('-created').exec(function(err, comments) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(comments);
    });
};

exports.commentByID = function(req, res, next, id) {
    Comment.findOne({_id: id}).exec(function(err, comment) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        if(!comment) {
            return next(new Error('Failed to load article' + id));
        }
        else {
            req.comment = comment;
        }
        next();
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

exports.delete = function(req, res) {
    let comment = req.comment;

    comment.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(comment);
    });
};
