/**
* Comment model definition.
* Created by Kudzai Gopfa on 3/6/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const mongoose    =  require('mongoose');
const Schema      =  mongoose.Schema;

let CommentSchema = new Schema({
    comment: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: Schema.ObjectId,
        ref: 'Images'
    },
    posted_by: {
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
