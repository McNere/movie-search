var express = require("express");
var router = express.Router();
var request = require("request");
var bodyParser = require("body-parser");
var middleware = require("../middleware");
var User = require("../models/user.js");
var fetch = require("node-fetch");

router.get("/search", function(req,res) {
    var searchTerm = "http://www.omdbapi.com/?s=" + req.query.title + "&apikey=" + process.env.APIKEY;
    // request(searchTerm, function(error, response, body) {
    //     if (!error && response.statusCode === 200) {
    //         var data = JSON.parse(body);
    //         res.render("search/result", {dataObj: data});
    //     }
    //     else console.log(error);
    // });
    fetch(searchTerm).then(result => result.json()).then(data => res.render("search/result", {dataObj: data})).catch(err => console.log(err));
});

router.get("/search/:id", function(req,res) {
    var searchTerm = "http://www.omdbapi.com/?i=" + req.params.id + 
    "&apikey=" + process.env.APIKEY + "&plot=full";
    request(searchTerm, function(err, response, body) { //request data from API
        if (!err && response.statusCode === 200) {
            var data = JSON.parse(body);
            User.find({}).where("likedMovies.imdbId").equals(data.imdbID).exec(function(err, users) {
                if (err) {
                    console.log(err);
                    res.redirect("/");
                } else {
                    res.render("search/movie", {movie: data, users: users});
                }
            });
        }
        else console.log(err);
    });
});

router.post("/search/:id", middleware.isLoggedIn, function(req,res) {
    User.findById(req.user._id).where("likedMovies.imdbId").ne(req.body.imdbId).exec(function(err, foundUser) {
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