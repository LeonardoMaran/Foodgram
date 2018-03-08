var jwt = require('jsonwebtoken');
var secrets = require('../config/secrets');

/*
 * Validate token and add decoded id to the request
 */
function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];

    if (!token) return res.status(403)
        .send({
            message: 'No token provided.',
            auth: false
        }); // 401 Unauthorized

    jwt.verify(token, secrets.secret, function (err, decoded) {
        if (err) return res.status(500)
            .send({
                message: 'Failed to authenticate token.',
                auth: false
            }); // 500 Server Error

        // Success => save to request for other routes
        req.userId = decoded.id;
        next();
    });
}

module.exports = verifyToken;