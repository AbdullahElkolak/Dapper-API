var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    content: {
        type: String,
        trim: true
    },
    written: {
        type: Date,
        default: Date.now
    },
    parent: {
        type: Schema.ObjectId,
        ref: 'Post',
        required: true
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

mongoose.model('Comment', CommentSchema);
