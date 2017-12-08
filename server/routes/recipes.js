let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    recipeSchema = require('../models/recipe.js');

router.get('/', function(req, res) {
    let query = recipeSchema.find({});

    query.exec(function (err, recipes) {
        if (err) {
            sendError(res, err.message, 500);
        } else {
            res.status(200).send({
                message: 'OK',
                data: recipes
            });
        }
    });
});

router.post('/', function(req, res) {
    let recipe = {
        title: req.body.title,
        description: req.body.description
    };

    recipeSchema.create(recipe, function (err, createdRecipe) {
        if (err) {
            sendError(res, err.message, 500);
        } else {
            res.status(201).send({
                message: 'Recipe added',
                data: createdRecipe
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