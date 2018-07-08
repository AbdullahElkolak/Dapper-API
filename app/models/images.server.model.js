/**
* Images model definition.
* Created by Kudzai Gopfa on 3/6/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/
const mongoose   =  require('mongoose');
const Schema     =  mongoose.Schema;

let ImageSchema = new Schema({
    image_url: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    user: {
        username: String,
        avatar: String
    },
    location: String,
    posted_by: String,
<<<<<<< HEAD
    comments: [{
        comment_id: Number,
        comment: String,
        comment_by: {
            type: Schema.ObjectId,
            ref: 'Users'
        }
    }],
    user: {
        type: Schema.ObjectId,
        ref: 'Users'
    },
=======
>>>>>>> development
    liked_by: [{
        type: Schema.ObjectId,
        ref: 'Users'
    }],
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
});

ImageSchema.statics.checkImageID = function(name) {
    this.findOne({image: name}, function(err, image) {
        if(!err) {
            if (image) {
                return true;
            } else return false;
        } else return 'Failed to connect to Server';
    });
};

mongoose.model('Images', ImageSchema);
