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

router.post("/search/:id", middleware.isLoggedIn, middleware.logMovie, function(req,res) {
    Movie.findOne({imdbId: req.body.imdbId}, function(err, foundMovie) {
        if (err || !foundMovie) {
            console.log(err);
            res.redirect("/");
        } else {
            //checks if user is in movie's favorited list and adds if they aren't
            var userCheck = foundMovie.usersLiked.filter(function(user) { return user.username === req.user.username });
            if (!userCheck[0]) {
                foundMovie.usersLiked.push(req.user);
                foundMovie.save();
            }
        }
        //checks if movie is on user's list and adds if it isn't
        User.findById(req.user._id).where("likedMovies.imdbId").ne(foundMovie.imdbId).exec(function(err, foundUser) {
            if (err) {
                console.log(err);
                res.redirect("/");
            } else if (foundUser) {
                foundUser.likedMovies.push(foundMovie);
                foundUser.save();
            }
            res.redirect("back");
        });
    });
});

module.exports = router;