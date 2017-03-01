var index = require('../controller/index.server.controller');

module.exports = function(app) {
    app.get('/', index.renderIndex);
};
