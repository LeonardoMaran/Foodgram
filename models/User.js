'use strict';

// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicUrl: { type: String, default: "" },
    favorites: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    following: { type: [mongoose.Schema.Types.ObjectId], default: [] },
    followers: { type: [mongoose.Schema.Types.ObjectId], default: [] }
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map