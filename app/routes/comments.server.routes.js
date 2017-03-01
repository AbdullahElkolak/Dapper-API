var users = require('../controller/users.server.controller'),
    comments = require('../controller/comments.server.controller');

module.exports = function(app) {
    app.route('/posts/:postId/comments').get(comments.ListComments)
        .post(users.CheckLogin, comments.CreateComment);

    app.delete('/posts/:postId/comments/:commentId', comments.CheckUser, comments.DeleteComment);

    app.param('commentId', comments.CommentByID);
};