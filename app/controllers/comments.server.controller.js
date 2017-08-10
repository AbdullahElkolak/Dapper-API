/**
* Comments controller.
* Created by Kudzai Gopfa on 3/5/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/
const config     =  require('../../config/env/development.js');

/**
* Models
*/

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
        return 'Oops! Something went wrong, please try again later.';
    }
};

exports.create = function(req, res) {
    let image        =  req.image;

    image.comments.push({
                            comment: req.body.comment,
                            comment_by: req.user
                        });

    image.save(function(err, image_u) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else return res.json(image_u);
    });
};

exports.commentByID = function(req, res, next, id) {
    let image = req.image;
    image.comments.forEach(function(comment) {
        if(escape(comment._id) === id) {
            req.comment = comment;
            return next();
        }
    });
};

exports.read = function(req, res) {
    res.json(req.comment);
};

exports.checkUser = function(req, res, next) {
    let image = req.image;
    if(!(escape(req.user.id) === escape(image.comments.comment_by._id))) {
        res.status(403).send({
            message: 'Action only available to author'
        });
    } else next();
};

exports.delete = function(req, res) {
    let image        =  req.image;

    image.update({ $pullAll: {'comments': [req.comment] } }, {new: true}, function(err, image_u) {
        if(err) {
            console.log(err);
            return res.send({message: getErrorMessage(err)});
        } else return res.json(image_u);
    });
};
