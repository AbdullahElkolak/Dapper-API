var Comment = require('mongoose').model('Comment');

var getErrorMessage = function(err) {
    if(err.errors) {
        var message = '';
        for(var i in err.errors) {
            if(err.errors[i].message) {
                message = err.errors[i].message;
            }
        }
        return message;
    } else {
        return 'Unknown server error';
    }
};

exports.CreateComment = function(req, res) {
    var comment = new Comment(req.body);
    comment.author = req.user;
    comment.parent = req.article;

    comment.save(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(comment);
    });
};

exports.ListComments = function(req, res) {
    Comment.find({}).sort('-created').populate('author', 'username').exec(function(err, comments) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(comments);
    });
};

exports.CommentByID = function(req, res, id, next) {
    Comment.findOne({_id: id}).populate('author', 'username').exec(function(err, comment) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            })
        }
        if(!comment) {
            return next(new Error('Failed to load article' + id));
        }
        else {
            req.comment = comment;
        }
        next();
    });
};

exports.CheckUser = function(req, res, next) {
    var comment = req.comment;
    if(!req.user.id === comment.author.id) {
        res.status(403).send({
            message: 'Action only available to author'
        });
    } else next();
};

exports.DeleteComment = function(req, res) {
    var comment = req.comment;

    comment.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else res.json(comment);
    });
};

