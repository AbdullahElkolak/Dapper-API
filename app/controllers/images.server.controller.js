/**
* Images controller.
* Created by Kudzai Gopfa on 3/5/2017.
* MIT Licensed
*/

'use strict'

/**
* Module dependencies
*/

const path       =  require('path');
const fs         =  require('fs');
const fse        =  require('fs-extra');
const Busboy     =  require('busboy');
const mongoose   =  require('mongoose');
const Images     =  mongoose.model('Images');
const Follow     =  mongoose.model('Follow');

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
    let image = new Images(),
        user  = req.user;

    let busboy = new Busboy({ headers: req.headers });
    let ext = '', possiblename = '';

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        ext = path.extname(filename).toLowerCase();

        var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
            imgID = createID(possible, possiblename) + ext;

        while(Images.checkImageID(imgID)) {
            imgID = createID(possible, possiblename) + ext;
        }

        let save_dir =  __dirname + '/../../uploads/user_' + user._id;

        fse.ensureDirSync(save_dir);

        file.pipe(fs.createWriteStream(path.join(save_dir, imgID)));
        image.image_url =  imgID;
        image.posted_by =  user._id;

    });

    busboy.on('field', function(fieldname, description) {
        image.description = description;
    });

    busboy.on('finish', function() {
        console.log('Upload complete');

        image.save(function(err) {
            if(err) {
                return res.send({message: err/*'Error occurred while uploading file'*/});
            } else res.json(image);
        });

    });

    return req.pipe(busboy);
};

exports.imageByID = function(req, res, next, id) {
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
    Follow.aggregate([
      {"$match": {follower: escape(req.user._id)}},
      { "$lookup":{
          from: 'images',
          localField: 'following',
          foreignField: 'posted_by',
          as: 'content'
      }}
    ]).exec(function(err, content) {
        if(err)
          return res.json(err);
        else return res.json(content);
    });
};

exports.checkUser = function(req, res, next) {
    let image = req.image;
    if(!(escape(req.user._id) === escape(image.posted_by._id))) {
        res.status(403).send({
            message: 'Action only available to author'
        });
    } else next();
};

exports.update = function(req, res) {
    let image = req.image;
    if(req.user._id === image.posted_by) {
        image.description = req.body.description;

        image.save(function(err) {
            if(err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else res.send({
                result    : image,
                success   : true
            });
        });
    } else {
        return res.send({
            success: false,
            message: "This action is only available to the author."
        });
    }
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
