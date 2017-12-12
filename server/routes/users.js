let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    userSchema = require('../models/user.js');

router.get('/', function(req, res) {
    let queryParams = getParsedParamObject(req);
    let query = userSchema.find({});
    applyQueryParamsToQuery(query, queryParams);

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

router.get('/:id', function(req, res) {
    let queryParams = getParsedParamObject(req);
    let query = userSchema.findById(req.params.id);
    applyQueryParamsToQuery(query, queryParams);

    query.exec(function (err, user) {
        if (err || user === null) {
            let errorMessage = "User not found";
            sendError(res, errorMessage, 404);
        } else {
            res.status(200).send({
                message: 'OK',
                data: user
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

// PUT A FAVORITE RECIPE FOR THIS USER
router.put('/favoriteRecipe/:id', function(req, res) {
    let recipe = {
        title: req.body.title,
        description: req.body.description,
        postedBy: req.body.postedBy,
        imageUrl: req.body.imageUrl,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions
    };

    userSchema.findById(req.params.id, function(err, user) {
        if (err) {
            sendError(res, err.message, 404);
        } else {
            user.favorites.push(recipe);
            user.save(function (err, favorite) {
                res.status(200).send({
                    message: 'Added favorite',
                    data: favorite
                });
            });
        }
    });
});

router.delete('/:id', function(req, res) {
    userSchema.findById(req.params.id, function (err, user) {
        if (err || user === null) {
            let errorMessage = "User not found";
            sendError(res, errorMessage, 404);
        } else {
            userSchema.remove({"_id": mongoose.Types.ObjectId(req.params.id)}, function (err, user) {
                if (err) {
                    let errorMessage = "User not found";
                    sendError(res, errorMessage, 404);
                } else {
                    res.status(200).send({
                        message: 'User deleted',
                        data: user
                    });
                }
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
