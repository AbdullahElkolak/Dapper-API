var users = require('../controller/users.server.controller'),
    posts = require('../controller/posts.server.controller');

module.exports = function(app) {
    app.route('/posts').get(users.CheckLogin, posts.ListPosts)
        .post(users.CheckLogin, posts.CreatePost);

    app.route('/posts/:postId').get(posts.ReadPost)
        .put(posts.CheckUser, posts.UpdatePost).delete(posts.CheckUser, posts.DeletePost);

    app.param('postId', posts.PostsByID);
};