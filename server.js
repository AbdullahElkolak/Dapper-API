/**
 * Application main server file
 * Created by Kudzai Gopfa on 3/5/2017.
 */
var express = require('./configuration/express');
var mongoose = require('./configuration/mongoose');

var db = mongoose();
var app = express();

app.set('port', process.env.PORT || 3400);

app.listen(app.get('port'), function() {
    console.log('Server running on PORT: ' + app.get('port'));
});
