const path       =  require('path');
const fs         =  require('fs');
const Busboy     =  require('busboy');
const mongoose   =  require('mongoose');
const Images     =  mongoose.model('Images');
const Users      =  mongoose.model('Users');

let getErrorMessage = function(err) {
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

exports.upload = function(req, res) {
    let image = new Images();

    let busboy = new Busboy({ headers: req.headers });
    let ext = '', possiblename = '';

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        ext = path.extname(filename).toLowerCase();

        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
            imgID = createID(possible, possiblename) + ext;

        while(Images.checkImageID(imgID)) {
            imgID = createID(possible, possiblename) + ext;
        }

        let saveTo = path.join('./uploads', imgID);

        image.imageUrl =  imgID;
        image.postedBy = req.user;

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

exports.imageByID = function(req, res, id, next) {
    Images.findOne({_id: id}).populate('author', 'username').exec(function(err, image) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }
        if(!image) {
            return next(new Error('Failed to load article' + id));
        }
        else {
            req.image = image;
        }
        next();
    });
};

exports.read = function(req, res) {
    res.json(req.image);
};

exports.list = function(req, res) {
    Images.find({}).sort('-timestamp').populate('postedBy', 'username').exec(function(err, images) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }  else  {
            return res.json(images);
        }
    });
};

exports.checkUser = function(req, res, next) {
    var image = req.image;
    if(!req.user.id === image.postedBy.id) {
        res.status(403).send({
            message: 'Action only available to author'
        });
    } else next();
};

exports.update = function(req, res) {
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

exports.delete = function(req, res) {
    let image = req.image;

    image.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
    });
};
