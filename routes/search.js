var express = require("express");
var router = express.Router();
var request = require("request");
var bodyParser = require("body-parser");
var Movie = require("../models/movie.js");
var middleware = require("../middleware");
var User = require("../models/user.js");

router.get("/search", function(req,res) {
    var searchTerm = "http://www.omdbapi.com/?s=" + req.query.title + "&apikey=" + process.env.APIKEY;
    request(searchTerm, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var data = JSON.parse(body);
            res.render("search/result", {dataObj: data});
        }
        else console.log(error);
    });
});

router.get("/search/:id", function(req,res) {
    var searchTerm = "http://www.omdbapi.com/?i=" + req.params.id + 
    "&apikey=" + process.env.APIKEY + "&plot=full";
    request(searchTerm, function(err, response, body) { //request data from API
        if (!err && response.statusCode === 200) {
            var data = JSON.parse(body);
            Movie.findOne({imdbId: data.imdbID}, function(err, movie) { //check if movie exists in database
                if (err) {
                    console.log(err);
                } else {
                    res.render("search/movie", {movie: data, users: movie}); //passes in movie data and data about users (if applicable)
                }
            });
        }
        else console.log(err);
    });
});

router.post("/search/:id", middleware.isLoggedIn, function(req,res) {
    var searchTerm = "http://www.omdbapi.com/?i=" + req.params.id +
    "&apikey=" + process.env.APIKEY;
    Movie.findOne({imdbId: req.params.id}, function(err, foundMovie) { //check if movie already is in database
        if (err) {
            console.log(err);
        } else if (!foundMovie) { //logs the movie in database if it doesn't exist
            var movieObj = {
                title: req.body.title,
                imdbId: req.body.imdbID,
                usersLiked: [{
                    _id: req.user._id,
                    username: req.user.username
                }]
            }
            Movie.create(movieObj, function(err, movie) {
                if (err) {
                    console.log(err);
                } else {
                    User.findById(req.user._id, function(err, user) {
                        if (err) {
                            console.log(err);
                        } else {
                            user.likedMovies.push(movie);
                            user.save();
                        }
                    });
                    res.redirect("/");
                }
            })
        }
    });
        
});

module.exports = router;