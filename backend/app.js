// pass ImJcSOV19kZZZ3GQ

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const app = express();

mongoose.connect("mongodb+srv://ElorK:ImJcSOV19kZZZ3GQ@recipeloredb.st6xv68.mongodb.net/?retryWrites=true&w=majority")
    .then(() =>
        console.log("Everything is okay!")
    )
    .catch(() =>
        console.log("Something went wrong...")
    );

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requseted-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
});

app.post('/api/recipes', (req, res, next) => {
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

app.get('/api/recipes', (req, res, next) => {
    Recipe.find().then(documents => {
        res.status(200).json({
            message: 'Recipes fetched successfully',
            recipes: documents
        });
    });
});

app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findById(req.params.id).then(recipe =>{
        if(recipe){
            res.status(200).json(recipe)
        }
        else {
            res.status(404).json({message: "Recipe not found"})
        }
    })
})

app.put('/api/recipes/:id', (req, res, next) => {
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

app.delete('/api/recipes/:id', (req, res, next) => {
    Recipe.deleteOne({ _id: req.params.id }).then(result => {
        console.log(result);
        res.status(200).json({ message: 'Recipe deleted successfully' })
    })
})

module.exports = app;