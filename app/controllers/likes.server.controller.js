/**
* Likes controller.
* Created by Kudzai Gopfa on 29/7/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const Image       =  require('mongoose').model('Images');

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
    let image        =  new Image(req.image);
    image.liked_by   =  req.user;

    image.save(function(err) {
        if(err) {
            return res.status(400).send(getErrorMessage(err));
        } else res.json(image);
    });
};

exports.list = function(req, res) {
    Image.find({_id: escape(req.image._id)}).populate('liked_by', 'username').sort('-created').exec(function(err, likes) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(likes);
    });
};

exports.unlike = function(req, res) {
    let image_id = req.image._id;
    let liker_id = req.user._id;

    like.findByIdAndUpdate(image_id, { $pullAll: {liked_by: [liker_id] }, {new: true}, function(err, image) {
        if (err) {
            return res.status(401).send({
                message: getErrorMessage(err)
            });
        } else res.json(image);
    });
};
