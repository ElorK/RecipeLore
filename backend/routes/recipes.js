const express = require("express");
const router = express.Router();
const Recipe = require('../models/recipe');

router.post('', (req, res, next) => {
    const recipe = new Recipe({
        name: req.body.name,
        category: req.body.category,
        ingredients: req.body.ingredients,
        process: req.body.process,
        imageUrl: req.body.imageUrl
    });
    recipe.save().then((newRecipe) => {
        res.status(201).json({
            message: 'Recipe added successfully',
            recipeId: newRecipe._id
        });
    });
})

router.get('', (req, res, next) => {
    Recipe.find().then(documents => {
        res.status(200).json({
            message: 'Recipes fetched successfully',
            recipes: documents
        });
    });
});

router.get('/:id', (req, res, next) => {
    Recipe.findById(req.params.id).then(recipe =>{
        if(recipe){
            res.status(200).json(recipe)
        }
        else {
            res.status(404).json({message: "Recipe not found"})
        }
    })
})

router.put('/:id', (req, res, next) => {
    const updatedRecipe = new Recipe({
        _id: req.body.id,
        name: req.body.name,
        category: req.body.category,
        ingredients: req.body.ingredients,
        process: req.body.process,
        imageUrl: req.body.imageUrl
    })
    Recipe.updateOne({ _id: req.params.id }, updatedRecipe).then(result => {
        console.log(result);
        res.status(200).json({ message: 'Recipe updated successfully' })
    })
})

router.delete('/:id', (req, res, next) => {
    Recipe.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: 'Recipe deleted successfully' })
    })
})

module.exports = router;