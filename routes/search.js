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
                    res.render("search/movie", {movie: data, users: movie}); //passes in movie data and data about users
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
        console.log(foundMovie);
        if (err) {
            console.log(err);
        } else {
            request(searchTerm, function(err, response, body) { //request data from API
                if (!err && response.statusCode === 200) {
                    var data = JSON.parse(body);
                    var newObj = {
                        imdbId: data.imdbID,
                        title: data.Title,
                        usersLiked: [{
                            _id: req.user._id,
                            username: req.user.username
                        }]
                    }
                    if (!foundMovie) { //log movie in database if not found
                        Movie.create(newObj, function(err, movie) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(movie);
                                // User.byIdAndUpdate(req.user._id, function(err, user) {
                                //     if (err) {
                                //         console.log(err);
                                //     } else {
                                //         user.likedMovies.push({id: movie._id, title: movie.title});
                                //     }
                                // })
                                res.redirect("back");
                            }
                        });
                    } else {
                        res.redirect("back");
                    }
                }
            });
        }
    });
        
});

module.exports = router;