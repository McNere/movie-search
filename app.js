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
var middleware = require("./middleware");

//REQUIRE ROUTES
var indexRoutes = require("./routes/index.js");
var searchRoutes = require("./routes/search.js")

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

//ROUTES
app.use(indexRoutes);
app.use(searchRoutes);

//LISTENER
app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server is running");
});