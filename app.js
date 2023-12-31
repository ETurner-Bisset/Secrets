//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const port = 3000;
const app = express();

console.log(process.env.SECRET);
 
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);
 
app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save()
        .then(res.render("secrets"))
        .catch((err) => {
            console.log(err);
        });
    
});

app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const foundUser = await User.findOne({email: username}).exec();
        if (foundUser) {
            if (foundUser.password === password) {
                res.render("secrets");
            }
        }
    
});
 
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
