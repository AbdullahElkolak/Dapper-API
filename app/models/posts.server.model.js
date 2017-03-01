var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var postlike = {
    userID: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    rating: Number
};

var PostSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: true
    },
    content: {
        type: String,
        trim: true,
        required: true
    },
    author: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    written: {
        type: Date,
        default: Date.now
    },
    views: Number,
    likes: [postlike],
    dislikes: [postlike]
});

mongoose.model('Posts', PostSchema);