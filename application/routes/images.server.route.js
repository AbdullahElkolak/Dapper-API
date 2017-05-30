var image = require('./../controllers/images.server.controller.js');
var users = require('./../controllers/users.server.controller.js');
var passport = require('passport');

module.exports = function(app) {
    app.post('/images', passport.authenticate('jwt', {session: false}),image.ListImages)
        //.post(users.confirmLogin, image.imageUpload);

    app.get('/images/upload', users.confirmLogin, image.renderUploadForm);

    app.route('/images/:imageId').get(image.ReadPost)
        .put(image.CheckUser, image.UpdatePost).delete(image.CheckUser, image.DeletePost);

    app.param('imageId', image.ImageByID);
};
