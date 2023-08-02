const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    ingredients: [String],
    process: [String],
    imageUrl: String
});

module.exports = mongoose.model('Recipe', recipeSchema);