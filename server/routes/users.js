let express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    userSchema = require('../models/user.js');

router.get('/', function (req, res) {
    let queryParams = getParsedParamObject(req);
    let query = userSchema.find({});
    applyQueryParamsToQuery(query, queryParams);

    query.exec(function (err, users) {
        if (err) {
            sendError(res, err.message, 500);
        } else {
            res.status(200)
                .send({
                    message: 'OK',
                    data: users
                });
        }
    });
});

router.get('/:id', function (req, res) {
    let queryParams = getParsedParamObject(req);
    let query = userSchema.findById(req.params.id);
    applyQueryParamsToQuery(query, queryParams);

    query.exec(function (err, user) {
        if (err || user === null) {
            let errorMessage = "User not found";
            sendError(res, errorMessage, 404);
        } else {
            res.status(200)
                .send({
                    message: 'OK',
                    data: user
                });
        }
    });
});

router.get('/profilePicUrl/:id', function (req, res) {
    let query = userSchema.findById(req.params.id);

    query.exec(function (err, user) {
        if (err || user === null) {
            let errorMessage = "Profile pic not found";
            sendError(res, errorMessage, 404);
        } else {
            res.status(200)
                .send({
                    message: 'OK',
                    data: user.profilePicUrl
                });
        }
    });
});

router.get('/favorites/:id', function (req, res) {
    let query = userSchema.findById(req.params.id);

    query.exec(function (err, user) {
        if (err || user === null) {
            let errorMessage = "Favorites not found";
            sendError(res, errorMessage, 404);
        } else {
            res.status(200)
                .send({
                    message: 'OK',
                    data: user.favorites
                });
        }
    });
});

router.get('/following/:id', function (req, res) {
    let query = userSchema.findById(req.params.id);

    query.exec(function (err, user) {
        if (err || user === null) {
            let errorMessage = "Following users not found";
            sendError(res, errorMessage, 404);
        } else {
            res.status(200)
                .send({
                    message: 'OK',
                    data: user.following
                });
        }
    });
});

router.get('/followers/:id', function (req, res) {
    let query = userSchema.findById(req.params.id);

    query.exec(function (err, user) {
        if (err || user === null) {
            let errorMessage = "Followers not found";
            sendError(res, errorMessage, 404);
        } else {
            res.status(200)
                .send({
                    message: 'OK',
                    data: user.followers
                });
        }
    });
});

router.post('/', function (req, res) {
    let user = {
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
    };

    userSchema.create(user, function (err, createdUser) {
        if (err) {
            sendError(res, err.message, 500);
        } else {
            res.status(201)
                .send({
                    message: 'User added',
                    data: createdUser
                });
        }
    });
});

router.put('/profilePicUrl/:id', function (req, res) {
    let query = userSchema.findById(req.params.id);
    let profilePicUrl = req.body.profilePicUrl;

    query.exec(function (err, user) {
        if (err) {
            sendError(res, err.message, 500);
        } else {
            user.profilePicUrl = profilePicUrl;
            user.save(function (err, user) {
                if (err) {
                    let errorMessage = "Couldn't add profile pic";
                    sendError(res, errorMessage, 404);
                } else {
                    res.status(200)
                        .send({
                            message: 'Profile Pic Added Successfully',
                            data: user
                        });
                }
            });
        }
    });
});

// PUT A FAVORITE RECIPE FOR THIS USER
router.put('/favoriteRecipe/:id', function (req, res) {
    let query = userSchema.findById(req.params.id);
    let recipeId = req.body.recipeId;

    query.exec(function (err, user) {
        if (err) {
            sendError(res, err.message, 500);
        } else {
            user.favorites.push(recipeId);
            user.save(function (err, user) {
                if (err) {
                    let errorMessage = "Favorite not found";
                    sendError(res, errorMessage, 404);
                } else {
                    res.status(200)
                        .send({
                            message: 'Favorite added',
                            data: user
                        });
                }
            });
        }
    });
});

// DELETE A FAVORITED RECIPE FOR THIS USER
router.put('/unfavoriteRecipe/:id', function (req, res) {
    let query = userSchema.findById(req.params.id);
    let recipeId = req.body.recipeId;

    query.exec(function (err, user) {
        if (err) {
            sendError(res, err.message, 500);
        } else {
            user.favorites.pull(recipeId);
            user.save(function (err, user) {
                if (err) {
                    let errorMessage = "Favorite not found";
                    sendError(res, errorMessage, 404);
                } else {
                    res.status(200)
                        .send({
                            message: 'Favorite deleted',
                            data: user
                        });
                }
            });
        }
    });
});

// PUT A FOLLOWING FOR THIS USER
router.put('/follow/:id', function (req, res) {
    let query = userSchema.findById(req.params.id);
    let followingId = req.body.followingId;

    query.exec(function (err, user) {
        if (err) {
            sendError(res, err.message, 500);
        } else {
            user.following.push(followingId);
            user.save(function (err, user) {
                if (err) {
                    let errorMessage = "User not found";
                    sendError(res, errorMessage, 404);
                } else {
                    res.status(200)
                        .send({
                            message: 'Following added',
                            data: user
                        });
                }
            });
        }
    });
});

// DELETE A FOLLOWING FOR THIS USER
router.put('/unfollow/:id', function (req, res) {
    let query = userSchema.findById(req.params.id);
    let followingId = req.body.followingId;

    query.exec(function (err, user) {
        if (err) {
            sendError(res, err.message, 500);
        } else {
            user.following.pull(followingId);
            user.save(function (err, user) {
                if (err) {
                    let errorMessage = "User not found";
                    sendError(res, errorMessage, 404);
                } else {
                    res.status(200)
                        .send({
                            message: 'Following removed',
                            data: user
                        });
                }
            });
        }
    });
});

// PUT A FOLLOWER FOR THIS USER
router.put('/follower/:id', function (req, res) {
    let query = userSchema.findById(req.params.id);
    let followerId = req.body.followerId;

    query.exec(function (err, user) {
        if (err) {
            sendError(res, err.message, 500);
        } else {
            user.followers.push(followerId);
            user.save(function (err, user) {
                if (err) {
                    let errorMessage = "User not found";
                    sendError(res, errorMessage, 404);
                } else {
                    res.status(200)
                        .send({
                            message: 'Follower added',
                            data: user
                        });
                }
            });
        }
    });
});

router.delete('/:id', function (req, res) {
    userSchema.findById(req.params.id, function (err, user) {
        if (err || user === null) {
            let errorMessage = "User not found";
            sendError(res, errorMessage, 404);
        } else {
            userSchema.remove({
                "_id": mongoose.Types.ObjectId(req.params.id)
            }, function (err, user) {
                if (err) {
                    let errorMessage = "User not found";
                    sendError(res, errorMessage, 404);
                } else {
                    res.status(200)
                        .send({
                            message: 'User deleted',
                            data: user
                        });
                }
            });
        }
    });
});

function sendError(res, errorMessage, errorNumber) {
    res.status(errorNumber)
        .send({
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
module.exports = function () {
    return router
};