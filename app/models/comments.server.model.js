/**
* Comments model definition.
* Created by Kudzai Gopfa on 14/8/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/
const mongoose   =  require('mongoose');
const Schema     =  mongoose.Schema;

let CommentSchema = new Schema({
    image: {
        type: Schema.ObjectId,
        ref: 'Images'
    },
    comment: {
        type: String,
        trim: true
    },
    comment_by: {
        type: Schema.ObjectId,
        ref: 'Users'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
});

mongoose.model('Comment', CommentSchema);
