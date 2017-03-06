var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CommentSchema = new Schema({
    content: {
        type: String,
        trim: true,
        required: true
    },
    parent: {
        type: Schema.ObjectId,
        ref: 'Images'
    },
    postedBy: {
        type: Schema.ObjectId,
        ref: 'Users'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('Comment', CommentSchema);
