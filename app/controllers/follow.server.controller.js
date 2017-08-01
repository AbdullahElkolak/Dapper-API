/**
* Follow controller.
* Created by Kudzai Gopfa on 29/7/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/
const Follow       =  require('mongoose').model('Follow');

exports.populateFollowers = function(req, res, next) {
    Follow.find({following: escape(req.profile._id)}, function(err, follows) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        }
        else {
            console.log(follows);
            req.followers = follows;
        }
        next();
    });
};

exports.populateFollowing = function(req, res, next) {
    Follow.find({follower: escape(req.profile._id)}, function(err, follows) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        }
        else {
            console.log(follows);
            req.following = follows;
        }
        next();
    });
};

exports.listFollowing = function(req, res) {
    return res.json(req.following);
}

exports.listFollowers = function(req, res) {
    return res.json(req.followers);
}

exports.follow = function(req, res) {
    Follow.update({follower: req.user}, {following: req.profile}, { upsert: true }, function(err, follows) {
        if (err) {
            return res.json(err);
        } else return res.json(follows);
    });
};

exports.unfollow = function(req, res) {
    if(req.user && req.profile) {
        Follow.remove({user: req.user}, {follow: req.profile},function(err) {
            if(err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            }
        });
    }
};
