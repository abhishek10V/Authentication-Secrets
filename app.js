//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encypt = require("mongoose-encryption");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/secretsDB" , {useNewUrlParser : true});

const UserSchema = new mongoose.Schema({
  email : String,
  password : String
});

//const secrets = process.env.SECRETS;

UserSchema.plugin(encypt , {secret: process.env.SECRETS , encryptedFields: ["password"]});

const User = new mongoose.model("User" , UserSchema);

app.get("/" , function(req , res){
    res.render("home");
});

app.get("/login" , function(req , res){
    res.render("login");
});

app.get("/register" , function(req , res){
    res.render("register");
});

app.post("/register" , function(req , res){
  const newUser = new User({
    email : req.body.username,
    password: req.body.password
  });

  newUser.save().then(() => res.render("secrets")).catch((err) => res.send(err));
});

app.post("/login" ,function(req , res){
  const username = req.body.email;
  const password = req.body.password;
User.findOne({email : username}).then(function(foundUser){
  if(foundUser){
    if(foundUser.password === password){
      res.render("secrets");
    } else{
      res.send("Incorrect password");
    }
  } else{
    res.send("User not found");
  }
    
});
  
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});