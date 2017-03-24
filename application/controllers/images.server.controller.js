var path = require('path');
var fs = require('fs');
var Busboy = require('busboy');
var mongoose = require('mongoose');
var Images = mongoose.model('Images');

var getErrorMessage = function(err) {
    if(err.errors) {
        var message = '';
        for (var i in err.errors) {
            if (err.errors[i].message) {
                message = err.errors[i].message;
            }
        }
        return message;
    } else {
        return "Unknown server error";
    }
};

function createID(possible, name) {
    for(var i = 0; i < 12; i++) {
        name += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return name;
}

exports.imageUpload = function(req, res) {
    var image = new Images();

    var busboy = new Busboy({ headers: req.headers });
    var ext = '', possiblename = '';

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        ext = path.extname(filename).toLowerCase();

        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
            imgID = createID(possible, possiblename) + ext;

        while(Images.checkImageID(imgID)) {
            imgID = createID(possible, possiblename) + ext;
        }

        var saveTo = path.join('./temp/store/uploads', imgID);

        image.imageName = saveTo;
        image.postedBy = req.user;

        console.log('Uploading: ' + saveTo);

        console.log('File type: ' + ext);
        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on('field', function(fieldname, val) {
        image.content = val;
    });

    busboy.on('finish', function() {
        console.log('Upload complete');

        image.save(function(err) {
            if(err) {
                return 'Error occurred in the Image upload controller';
            } else return res.json(image);
        });

    });

    return req.pipe(busboy);
};

exports.renderUploadForm = function (req, res) {
    res.render('ImageUpload');
};

exports.ImageByID = function(req, res, id, next) {
    Images.findOne({_id: id}).populate('author', 'username').exec(function(err, image) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }
        if(!article) {
            return next(new Error('Failed to load article' + id));
        }
        else {
            req.image = image;
        }
        next();
    });
};

exports.ReadPost = function(req, res) {
    res.json(req.image);
};

exports.ListImages = function(req, res) {
    Images.find({}).sort('-timestamp').populate('author', 'username').exec(function(err, images) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }  else return res.json(images);
    });
};

exports.CheckUser = function(req, res, next) {
    var image = req.image;
    if(!req.user.id === image.postedBy.id) {
        res.status(403).send({
            message: 'Action only available to author'
        });
    } else next();
};

exports.UpdatePost = function(req, res) {
    var image = req.image;

    image.content = req.body.content;

    image.save(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(image);
    });
};

exports.DeletePost = function(req, res) {
    var image = req.image;

    image.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
    });
};