const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv").config();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const middleware = require("./middleware");

//REQUIRE ROUTES
const indexRoutes = require("./routes/index.js");
const searchRoutes = require("./routes/search.js")

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

app.use((req,res,next) => {
  res.locals.currentuser = req.user;
  next();
});

mongoose.connect(process.env.DB_URL);

app.get("/", (req,res) => {
	console.log(req.user);
    res.render("home");
});

//ROUTES
app.use(indexRoutes);
app.use(searchRoutes);

//LISTENER
app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server is running");
});