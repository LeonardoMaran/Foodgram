'use strict';

var secrets = require('../config/secrets');

module.exports = function (router) {
    var homeRoute = router.route('/');

    homeRoute.get(function (req, res) {
        var connectionString = secrets.token;
        res.json({
            message: 'Nothing here. Go to /users or /recipes to use the API.',
            data: []
        });
    });

    return router;
};
//# sourceMappingURL=home.js.map