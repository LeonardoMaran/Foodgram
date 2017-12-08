// Load required packages
let mongoose = require('mongoose');

// Define our user schema
let UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    recipes: {type: [mongoose.Schema.RecipeSchema], default: []},
    following: {type: [mongoose.Schema.UserSchema], default: []},
    followers: {type: [mongoose.Schema.UserSchema], default: []}
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
