'use strict';

// Get the packages we need
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    secrets = require('./config/secrets'),
    bodyParser = require('body-parser');

// Create our Express application
var app = express();

// include Schema
require('/models/user.js');
require('/models/recipe.js');

// Use environment defined port or 4000
var port = process.env.PORT || 4000;

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
});

// Connect to a MongoDB
mongoose.connect(secrets.mongo_connection, { useMongoClient: true });

// Allow CORS so that backend and frontend could be put on different servers
var allowCrossDomain = function allowCrossDomain(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Use routes as a module (see index.js)
require('./routes')(app, router);

// Start the server
app.listen(port);
console.log('Server running on port ' + port);
//# sourceMappingURL=server.js.map