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
    follower: String,
    following: {
        type: Schema.ObjectId,
        ref: 'Users'
    }
});

mongoose.model('Follow', FollowSchema);
