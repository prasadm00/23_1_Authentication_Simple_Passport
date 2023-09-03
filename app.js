//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

console.log("Key==>>", process.env.SECRET);
mongoose.connect("mongodb://localhost:27017/userDB").then((result) => {
    console.log('Connected Successfully To the DB!');
}).catch((err) => {
    console.log("Error===>>>", err);
})

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

var secret = process.env.SECRET;
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema)

app.get("/", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    })
    newUser.save().then((result) => {
        console.log("Successfully added", result);
        res.render("secrets");
    }).catch((err) => {
        console.log("Error==>>", err);
    });
})

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ email: username }).then((result) => {
        if (result) {
            if (result.password === password) {
                res.render("secrets")
            }
        }
    }).catch((err) => {
        console.log("Error===>>>", err);
    });
})

app.listen(3000, function () {
    console.log("server started on port 3000");
})