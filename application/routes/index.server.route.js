/**
 * Created by kudza on 3/25/2017.
 */
var index = require('../controllers/index.server.controller');

module.exports = function(app) {
    app.get('/', index.renderIndex);
};