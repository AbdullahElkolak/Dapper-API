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

let getErrorMessage = function(err) {
    var message = '';
    if (err.code) {
        switch (err.code) {
            case 11000:
            case 11001:
                message = 'You are already following this user.';
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

exports.populateFollowers = function(req, res, next) {
    Follow.find({$and: [{following: escape(req.profile._id)}, {follower: {$ne: escape(req.user._id)}}]})
        .populate('following', '-salt -password -__v -provider')
        .exec(function(err, follows) {
        // $and: [{following: escape(req.profile._id)}, {follower: {$ne: escape(req.user._id)}}]
        if(err) {
            return res.status(400).send({
                message: err
            });
        }
        else {
            req.followers = follows;
        }
        next();
    });
};

exports.populateFollowing = function(req, res, next) {
    Follow.find({$and: [{follower: escape(req.profile._id)}, {following: {$ne : escape(req.profile._id)}}]})
        .populate('following', '-salt -password -__v -provider')
        .exec(function(err, follows) {
        if(err) {
            return res.status(400).send({
                message: err
            });
        }
        else {
            req.following = follows;
        }
        next();
    });
};

exports.followRecord = function(req, res, next, id) {
    Follow.findOne({_id: id}, function(err, following) {
        if(err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }
        if(!following) {
            return next(new Error('You are not following this user'));
        }
        else {
            req.followRecord = following;
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
    Follow.findOneAndUpdate({follower: escape(req.user._id), following: escape(req.profile._id)}, {upsert: true, new: true}, function(err, follows) {
        if (err) {
            return res.json(err);
        } else return res.json(follows);
    });
};

exports.unfollow = function(req, res) {
    let follow = req.followRecord;
    follow.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else return res.send({success: true})
    });
};
