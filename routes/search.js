const express = require("express");
const router = express.Router();
const request = require("request");
const bodyParser = require("body-parser");
const middleware = require("../middleware");
const User = require("../models/user.js");
const fetch = require("node-fetch");

router.get("/search", (req,res) => {
    const searchTerm = "http://www.omdbapi.com/?s=" + req.query.title + "&apikey=" + process.env.APIKEY;
    fetch(searchTerm)
    .then(result => result.json())
    .then(data => res.render("search/result", {dataObj: data}))
    .catch(err => console.log(err));
});

router.get("/search/:id", (req,res) => {
    const searchTerm = "http://www.omdbapi.com/?i=" + req.params.id + 
    "&apikey=" + process.env.APIKEY + "&plot=full";
    fetch(searchTerm)
    .then(result => result.json())
    .then(data => {
        User.find({}).where("likedMovies.imdbId").equals(data.imdbID).exec((err,users) => {
            if (err) {
                console.log(err);
                res.redirect("/");
            } else {
                res.render("search/movie", {movie: data, users: users});
            }
        })
    }).catch(err => console.log(err));
});

router.post("/search/:id", middleware.isLoggedIn, (req,res) => {
    User.findById(req.user._id).where("likedMovies.imdbId").ne(req.body.imdbId).exec((err, foundUser) => {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else if (foundUser) {
            foundUser.likedMovies.push({title: req.body.title, imdbId: req.body.imdbId});
            foundUser.save();
        }
        res.redirect("back");
    });
});

module.exports = router;