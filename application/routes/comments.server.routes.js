var users = require('./../controllers/users.server.controller'),
    comments = require('./../controllers/comments.server.controller');

module.exports = function(app) {
    app.route('/posts/:postId/comments').get(comments.ListComments)
        .post(users.confirmLogin, comments.CreateComment);

    app.delete('/posts/:postId/comments/:commentId', comments.CheckUser, comments.DeleteComment);

    app.param('commentId', comments.CommentByID);
};