var Post = require('mongoose').model('Posts'),
    path = require('path'),
    fs = require('fs'),
    multer = require('multer');


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

exports.CreatePost = function(req, res) {
    var post = new Post(req.body);
    post.author = req.user;

    //unique ID to each uploaded image
    var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
        imgUrl = '';

    for(var i = 0; i < 6; i++) {
        imgUrl += possible.charAt(Math.floor(Math.random() *
                  possible.length));
    }

    var tempPath = req.file.originalname,
        ext = path.extname(req.file.originalname).toLower(),
        targetPath = './app/controller/store' + imgUrl + ext;

    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif')
    {
        fs.rename(tempPath, targetPath, function(err) {
            if (err) throw err;
            res.redirect('/posts/'+ imgUrl);
        });
    } else {
        fs.unlink(tempPath, function () {
            if (err) throw err;
            res.json(500, {error: 'Only image files are allowed.'});
        });
    }

    post.filename = imgUrl + ext;

    post.save(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(post);
    });
};

exports.ReadPost = function(req, res) {
    res.json(req.article);
};

exports.PostsByID = function(req, res, id, next) {
    Post.findOne({_id: id}).populate('author', 'username').exec(function(err, article) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }
        if(!article) {
            return next(new Error('Failed to load article' + id));
        }
        else {
            req.article = article;
        }
        next();
    });
};

exports.ListPosts = function(req, res) {
    Post.find({}).sort('-written').populate('author', 'username').exec(function(err, articles) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }  else return res.json(articles);
    });
};

exports.CheckUser = function(req, res, next) {
    var post = req.article;
    if(!req.user.id === post.author.id) {
        res.status(403).send({
            message: 'Action only available to author'
        });
    } else next();
};

exports.UpdatePost = function(req, res) {
    var post = req.article;

    post.content = req.body.content;

    post.save(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(post);
    });
};

exports.DeletePost = function(req, res) {
    var post = req.article;

    post.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
    });
};

exports.renderPost = function(req, res) {
    res.render('article');
};
