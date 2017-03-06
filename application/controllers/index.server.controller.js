exports.renderIndex = function (req, res) {
    res.render('index', {
        username: req.user ? req.user.username: ''
    });
};
