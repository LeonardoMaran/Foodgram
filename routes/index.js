'use strict';

/*
 * Connect all of your endpoints together here.
 */
module.exports = function (app, router) {
    app.use('/api', require('./home.js')(router));
    app.use('/api/users', require('./users.js')(router));
    app.use('/api/recipes', require('./recipes.js')(router));
    app.use('/api/auth', require('./auth.js')(router));
};
//# sourceMappingURL=index.js.map