let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    userSchema = require('../models/user.js');

router.get('/', function(req, res) {
    let query = userSchema.find({});

    query.exec(function (err, users) {
        if (err) {
            sendError(res, err.message, 500);
        } else {
            res.status(200).send({
                message: 'OK',
                data: users
            });
        }
    });
});

router.post('/', function(req, res) {
    let user = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    };

    userSchema.create(user, function (err, createdUser) {
        if (err) {
            sendError(res, err.message, 500);
        } else {
            res.status(201).send({
                message: 'User added',
                data: createdUser
            });
        }
    });
});

function sendError(res, errorMessage, errorNumber) {
    res.status(errorNumber).send({
        message: errorMessage,
        data: []
    });
}

mongoose.Promise = global.Promise;
module.exports = function() {return router};