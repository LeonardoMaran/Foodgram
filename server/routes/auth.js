var secrets = require('../config/secrets');
var User = require('../models/user.js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var VerifyToken = require('./verifyToken');

module.exports = function (router) {
	var regRoute = router.route('/register'); // Register
	var userRoute = router.route('/me'); // User
	var loginRoute = router.route('/login') // Log in
	var logoutRoute = router.route('/logout') // Log out

	/**
	* @api {post} /register Register a new user
	*
	*/
	regRoute.post(function(req, res) {

		User.create({
			name: req.body.name,
			username: req.body.username,
			password: req.body.password,
			profilePicUrl: req.body.imageUrl
		}, function(err, user) {
			if (err) return res.status(500).send({message: 'There was a problem registering the user.', data: err}); // 500 Server Error

			// Create a token
			var token = jwt.sign({id: user._id}, secrets.secret, {
				expiresIn: 86400 // Expires in 24 hours
			});

			res.status(200).send({message: 'Registration successful.', auth: true, token: token}); //Success
		});
	});


	/**
	* @api {get} /me Return a user with an authentication token
	*
	*/
	userRoute.get(VerifyToken, function(req, res){

		// Retrieve user
		User.findById(req.userId, {password: 0}, function(err, user) {
			if (err) return res.status(500).send({message: 'There was a problem retrieving the user.', data: []}); // 500 Server Error
			if (!user) return res.status(404).send({message: 'User not found.', data: []}); // 404 Not found
			res.status(200).send({message: 'User found.', data: user}); // Success
		});

	});


	/**
	* @api {post} /login Log a user in and issue a token
	*
	*/
	loginRoute.post(function(req, res) {
		User.findOne({username: req.body.username}, function(err, user){
			if (err) return res.status(500).send({message: 'Server Error', data: []}); // 500 Server Error
			if (!user) return res.status(404).send({message: 'User not found.', data: []}); // 404 Not Found

			// Check if provided password is valid
			var passwordValid = (req.body.password === user.password);
			if(!passwordValid) return res.status(401).send({message: 'Invalid password.', auth: false, token: null, data: []});

			var token = jwt.sign({id: user._id}, secrets.secret, {
				expiresIn: 86400 // Expires in 24 hours
			});

			res.status(200).send({message: 'Login successful.', auth: true, token: token}); // Success
		});
	});


	/**
	* @api {get} /logout Log a user out.
	*
	*/

	logoutRoute.get(function(req, res) {
		if (err) return res.status(500).send({message: 'Server Error', data: []});
		res.status(200).send({message: 'Logout successful.', auth: false, token: null });
	});

	return router;
}
