// Load required packages
let mongoose = require('mongoose');

// Define our user schema
let RecipeSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        default: []
    },
    instructions: {
        type: String,
        default: ""
    },
    imageUrl: {
        type: String,
        default: ""
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Recipe', RecipeSchema);