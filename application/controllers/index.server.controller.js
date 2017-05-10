/**
 * Created by Kudzai Gopfa on 3/25/2017.
 */
exports.renderIndex = function(req, res) {
    res.render('index', {
        username: req.user ? req.user.username: ''
    });
};