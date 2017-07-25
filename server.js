/**
* Server configuration.
* Created by Kudzai Gopfa on 3/5/2017.
* MIT Licensed
*/

'use strict'

/**
* Environment configuration
*/

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

/**
* Module dependencies
*/

const express      =   require('./config/express');
const mongoose     =   require('./config/mongoose');

const db           =   mongoose();
const app          =   express();

app.set('port', process.env.PORT || 3400);

app.listen(app.get('port'), function() {
    console.log('Server running on PORT: ' + app.get('port'));
});
