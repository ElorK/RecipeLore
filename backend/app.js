// pass ImJcSOV19kZZZ3GQ

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const recipesRoutes = require('./routes/recipes')

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

app.use("/api/recipes", recipesRoutes);

module.exports = app;