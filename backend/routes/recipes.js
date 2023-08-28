const express = require("express");
const multer = require("multer");
const router = express.Router();
const Recipe = require('../models/recipe');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log(file);
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid MIME type");
        if (isValid){
            error = null;
        };
        cb(error, "backend/images")
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext)
    }
});

router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
    let imageUrl = req.body.imageUrl;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imageUrl = url + "/images/" + req.file.filename
    }
    const recipe = new Recipe({
        name: req.body.name,
        category: req.body.category,
        ingredients: req.body.ingredients,
        process: req.body.process,
        imageUrl: imageUrl
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

router.put('/:id', multer({storage: storage}).single("image"), (req, res, next) => {
    let imageUrl = req.body.imageUrl;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imageUrl = url + "/images/" + req.file.filename
    }
    const updatedRecipe = new Recipe({
        _id: req.body.id,
        name: req.body.name,
        category: req.body.category,
        ingredients: req.body.ingredients,
        process: req.body.process,
        imageUrl: imageUrl
    })
    console.log(imageUrl);
    console.log(updatedRecipe);
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