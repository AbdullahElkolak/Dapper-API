/**
* Follow model.
* Created by Kudzai Gopfa on 29/7/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const mongoose   =  require('mongoose');
const Schema     =  mongoose.Schema;

let FollowSchema = new Schema({
    follower: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    following: {
        type: Schema.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Follow', FollowSchema);