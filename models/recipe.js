'use strict';

// Load required packages
var mongoose = require('mongoose');
var passportlocalmongoose = require("passport-local-mongoose");

// Define our user schema
var RecipeSchema = new mongoose.Schema({
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    ingredients: { type: [String], default: [] },
    instructions: { type: String, default: "" },
    imageUrl: { type: String, default: "" }
});

// Export the Mongoose model
RecipeSchema.plugin(passportlocalmongoose);
module.exports = mongoose.model('Recipe', RecipeSchema);
//# sourceMappingURL=recipe.js.map