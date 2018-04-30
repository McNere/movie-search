var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");
var app = express();
var dotenv = require("dotenv").config();
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Movie = require("./models/movie.js");
var User = require("./models/user.js");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(require("express-session")({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.DB_URL);

app.get("/", function(req,res) {
    res.render("home");
});

app.get("/search", function(req,res) {
    var searchTerm = "http://www.omdbapi.com/?s=" + req.query.title + "&apikey=" + process.env.APIKEY;
    request(searchTerm, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            res.render("result", {dataObj: data});
        }
        else console.log(error);
    });
});

app.get("/search/:id", function(req,res) {
    var searchTerm = "http://www.omdbapi.com/?i=" + req.params.id + "&apikey=" + process.env.APIKEY;
    request(searchTerm, function(err, response, body) {
        if (!err && response.statusCode === 200) {
            var data = JSON.parse(body);
            console.log(data);
            res.render("movie", {dataObj: data});
        }
        else console.log(err);
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is running");
});