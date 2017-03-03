var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var postlike = {
    userID: {
        type: Schema.ObjectId,
        ref: 'User'
    }
};

var PostSchema = new Schema({
    image: {
        type: String,
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
    views: {type: Number,
            default: 0},
    likers: [postlike],
    likes: {
        type: Number,
        default: 0
    },
    dislikers: [postlike],
    dislikes: {
        type: Number,
        default: 0
    }
});

PostSchema.virtual('uniqueId').get(function() {
    return this.image.replace(path.extname(this.image), '');
});

mongoose.model('Posts', PostSchema);
