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
    let image        =  req.image;
    let conditions   =  {
                          _id: image._id,
                          'liked_by._id': {$ne: req.user._id}
                        };
    let update       =  {
                          $addToSet: { liked_by: req.user }
                        }

    Image.findByIdAndUpdate(conditions, update , {new: true}, function(err, image) {
        if (err) {
            return res.status(401).send({
                message: err/*getErrorMessage(err)*/
            });
        } else return res.json(image);
    });
};

exports.unlike = function(req, res) {
    let image        =  req.image;
    let conditions   =  {
                          _id: image._id,
                          'liked_by._id': {$ne: req.user._id}
                        };
    let update       =  {
                          $pull: { liked_by: req.user._id }
                        }

    Image.findByIdAndUpdate(conditions, update , {new: true}, function(err, image) {
        if (err) {
            return res.status(401).send({
                message: err/*getErrorMessage(err)*/
            });
        } else return res.json(image);
    });
};
