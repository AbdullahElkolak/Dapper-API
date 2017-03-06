/**
 * Created by kudza on 3/6/2017.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ImageSchema = new Schema({
    imageName: {
        type: String,
        required: true
    },
    content: {
        type: String,
        trim: true
    },
    location: String,
    postedBy: {
        type: Schema.ObjectId,
        ref: 'Users'
    },
    likes: {
        type: Number,
        default: 0
    },
    likedBy: {
        type: Schema.ObjectId,
        ref: 'Users'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
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