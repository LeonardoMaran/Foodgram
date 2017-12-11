let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    recipeSchema = require('../models/recipe.js');

// GET ALL RECIPES
router.get('/', function(req, res) {
    let queryParams = getParsedParamObject(req);
    let query = recipeSchema.find({});
    applyQueryParamsToQuery(query, queryParams);

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

// GET A SINGLE RECIPE BY ID
router.get('/:id', function(req, res) {
    let queryParams = getParsedParamObject(req);
    let query = recipeSchema.findById(req.params.id);
    applyQueryParamsToQuery(query, queryParams);

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

// POST A RECIPE
router.post('/', function(req, res) {
    let recipe = {
        title: req.body.title,
        description: req.body.description,
        postedBy: req.body.postedBy,
        imageUrl: req.body.imageUrl,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
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

// DELETE A RECIPE BY ID
router.delete('/:id', function(req, res) {
    recipeSchema.findById(req.params.id, function (err, recipe) {
        if (err || recipe === null) {
            let errorMessage = "Recipe not found";
            sendError(res, errorMessage, 404);
        } else {
            recipeSchema.remove({"_id": mongoose.Types.ObjectId(req.params.id)}, function (err, recipe) {
                if (err) {
                    let errorMessage = "Recipe not found";
                    sendError(res, errorMessage, 404);
                } else {
                    res.status(200).send({
                        message: 'Recipe deleted',
                        data: recipe
                    });
                }
            });
        }
    });
});


// HELPER FUNCTIONS
function sendError(res, errorMessage, errorNumber) {
    res.status(errorNumber).send({
        message: errorMessage,
        data: []
    });
}

function getParsedParamObject(req) {
    let queryParams = {
        whereParam: req.query.where,
        sortParam: req.query.sort,
        selectParam: req.query.select,
        skipParam: req.query.skip,
        limitParam: req.query.limit,
        countParam: req.query.count
    };

    for (let key in queryParams) {
        if (queryParams[key] === null || queryParams[key] === undefined) {
            delete queryParams[key];
        } else {
            queryParams[key] = JSON.parse(queryParams[key]);
        }
    }

    return queryParams;
}

function applyQueryParamsToQuery(query, queryParams) {
    for (let key in queryParams) {
        if (key === "limitParam") {
            query.limit(queryParams.limitParam);
        } else if (key === "countParam" && (queryParams.countParam === true)) {
            query.count();
        } else if (key === "selectParam") {
            query.select(queryParams.selectParam);
        } else if (key === "sortParam") {
            query.sort(queryParams.sortParam);
        } else if (key === "skipParam") {
            query.skip(queryParams.skipParam);
        } else if (key === "whereParam") {
            query.where(queryParams.whereParam);
        }
    }
}

mongoose.Promise = global.Promise;
module.exports = function() {return router};
